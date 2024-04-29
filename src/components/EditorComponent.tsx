'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'quill-emoji/dist/quill-emoji.css'; // Import Quill Emoji CSS

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

interface EditorProps {
    initialContent?: string;
    onpostDescriptionChange: (newContent: string) => void;
}

export default function EditorComponent({ onpostDescriptionChange, initialContent = '' }: EditorProps) {

    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent)
    }, [initialContent])


    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            // ['image'],
            [{ align: [] }],
            [{ color: [] }],
            // ['code-block'],
            ['clean'],
            ['video'],
            [{ script: 'sub' }, { script: 'super' }], // Include subscript and superscript modules
            [{ direction: 'rtl' }], // Include right-to-left direction module
            ['imageResize'], // Include image resize module
        ],
    };

    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        // 'image',
        'align',
        'color',
        // 'code-block',
        'video',
        'indent', // Include indent format
        'outdent', // Include outdent format
        'emoji', // Include emoji format
        'script', // Include script format
        'direction', // Include direction format
        'imageResize', // Include image resize format
        'mathjax', // Include mathjax format
    ];

    const handleEditorChange = (newContent: React.SetStateAction<string>) => {
        setContent(newContent);
        onpostDescriptionChange(newContent as string);
    };

    return (
        <>
            <main className='editor-main'>
                <div className="h-[50vh] w-max flex items-center flex-col">
                    <div className="h-full w-[90vw]">
                        <QuillEditor
                            value={content}
                            onChange={handleEditorChange}
                            modules={quillModules}
                            formats={quillFormats}
                            className="w-full h-[90.5%] mt-10 bg-white text-black" />
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .quill{
                 margin-top:0;
                }

                .quill .ql-container{
                    border:0;
                }

                .quill .ql-container .ql-editor{
                    background-color:white;
                    padding-bottom: 26px;
                }
            `}</style>
        </>
    );
}