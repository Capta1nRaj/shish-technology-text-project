import postListModel from '@/models/postListModel';
import { connect2MongoDB } from 'connect2mongodb';
import { NextResponse, type NextRequest } from 'next/server';

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

    const { postTitle, postDescription, postCategory } = await request.json();

    await connect2MongoDB();

    await new postListModel({
        title: postTitle,
        shortDescription: postDescription.replace(/<[^>]+>/g, ''),
        longDescription: postDescription,
        category: postCategory,
        image: "",
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
        image: "",
    });

    return NextResponse.json({ message: "Just A PUT Call In post.", statusCode: 302 }, { status: 200 });
}

export async function DELETE(request: NextRequest) {

    const { id } = await request.json();

    await postListModel.deleteOne({ _id: id });

    await connect2MongoDB();
    return NextResponse.json({ message: "Just A DELETE Call In post.", statusCode: 302 }, { status: 200 });
}