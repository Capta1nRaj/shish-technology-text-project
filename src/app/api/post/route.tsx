import postListModel from '@/models/postListModel';
import axios from 'axios';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server';
import OpenAI from 'openai';

// const openai = new OpenAI({
//     apiKey: process.env.OPEN_AI_API_KEY, // This is the default and can be omitted
// });


export async function GET(request: NextRequest) {

    //! Getting username from client-side
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');


    // Connecting to MongoDB
    await connect2MongoDB();

    if (id) {
        const postData = await postListModel.findById(id);
        return NextResponse.json({ message: "Just A GET Call In post.", statusCode: 302, postData }, { status: 200 });
    }

    const postLists = await postListModel.find({});

    return NextResponse.json({ message: "Just A GET Call In post.", statusCode: 302, postLists }, { status: 200 });
}

export async function POST(request: NextRequest) {
    console.clear();
    console.log("POST Function Started");

    // Generate image from text
    const options1 = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${process.env.MONSTER_API}`
        },
        body: JSON.stringify({ prompt: 'Advancements in Artificial Intelligence: A Look into the Future' })
    };

    const response1 = await fetch('https://api.monsterapi.ai/v1/generate/txt2img', options1);
    const data1 = await response1.json();
    console.log(data1.process_id);

    // Check status until completed
    let status = '';
    let imageLink = '';
    while (status !== 'COMPLETED') {
        const options2 = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.MONSTER_API}`
            }
        };

        const response2 = await fetch(`https://api.monsterapi.ai/v1/status/${data1.process_id}`, options2);
        const data2 = await response2.json();
        if (data2.status === 'COMPLETED') {
            imageLink = data2.result.output[0]
        }
        status = data2.status;

        if (status !== 'COMPLETED') {
            console.log('Process not completed, retrying...');
            // Delay before retrying (optional)
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
        }
    }

    // Once completed, proceed with other tasks
    const { postTitle, postDescription, postCategory } = await request.json();

    // Proceed with other tasks...
    await connect2MongoDB();
    console.log("imageLink: " + imageLink)
    await new postListModel({
        title: postTitle,
        shortDescription: postDescription.replace(/<[^>]+>/g, ''),
        longDescription: postDescription,
        category: postCategory,
        image: imageLink,
    }).save();

    return NextResponse.json({ message: "Just A POST Call In post.", statusCode: 302 }, { status: 200 });
}


export async function PUT(request: NextRequest) {
    const { id, postTitle, postDescription, postCategory } = await request.json();

    await connect2MongoDB();

    await postListModel.updateOne({ _id: id }, {
        title: postTitle,
        shortDescription: postDescription.replace(/<[^>]+>/g, ''),
        longDescription: postDescription,
        category: postCategory,
    });

    return NextResponse.json({ message: "Just A PUT Call In post.", statusCode: 302 }, { status: 200 });
}

export async function DELETE(request: NextRequest) {

    const { id } = await request.json();

    await postListModel.deleteOne({ _id: id });

    await connect2MongoDB();
    return NextResponse.json({ message: "Just A DELETE Call In post.", statusCode: 302 }, { status: 200 });
}