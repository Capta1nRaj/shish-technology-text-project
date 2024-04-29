'use client'

import EditorComponent from "@/components/EditorComponent";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  title: string;
  category: string;
}

const buttonCSS = `bg-white text-black font-bold px-4 py-2 rounded-full`;

export default function Home() {

  const [initialPage, setinitialPage] = useState(true);
  const [postList, setpostList] = useState([]);

  const [addPost, setaddPost] = useState(false)
  const [editPost, seteditPost] = useState(false);
  const [postId, setpostId] = useState('');
  const [postTitle, setpostTitle] = useState('');
  const [postCategory, setpostCategory] = useState('');
  const [postDescription, setpostDescription] = useState<string>('');


  //! Update editor value on change 
  const handlepostDescriptionChange = (newpostDescription: string) => {
    setpostDescription(newpostDescription);
  };

  //! Add a post to DB 
  async function addAPostFunction() {
    await axios.post(`/api/post`, { postTitle, postDescription, postCategory })
    setaddPost(!addPost);
    setinitialPage(!initialPage);
    resetStrings();
  }

  //! Reset Strings
  function resetStrings() {
    setpostTitle('');
    setpostCategory('');
    setpostDescription('');
  }

  //! Fetch posts list
  async function getPostList() {
    const response = await axios.get(`/api/post`)
    setpostList(response.data.postLists);
  }

  //! Enable Edit a post scene 
  async function editAPostFunction(id: string) {
    seteditPost(true);
    setinitialPage(false);
    const { data: { postData } } = await axios.get(`/api/post?id=${id}`)
    setpostTitle(postData.title);
    setpostCategory(postData.category);
    setpostDescription(postData.longDescription);
  }

  //! Delete a post
  async function deleteAPostFunction(id: string) {

    const config = {
      data: { id }
    };

    await axios.delete(`/api/post`, config);

    getPostList();
  }

  //! Update a post
  async function updatePost() {
    await axios.put(`/api/post`, { id: postId, postTitle, postDescription, postCategory });
    resetStrings();
    seteditPost(false);
    setinitialPage(true);
    getPostList();
  }

  //! Fetch post list on initial load 
  useEffect(() => {
    getPostList();
  }, [])

  return (
    <>

      {initialPage && (
        <>
          <main className="ml-5 mt-5 flex flex-col gap-2">
            <button className={`${buttonCSS} text-left w-fit`} onClick={() => { setaddPost(true); setinitialPage(false); }}> Add A Post </button>

            <table>
              <thead>
                <tr className="text-center border">
                  <th className="border py-4">Title</th>
                  <th className="border">Category</th>
                  <th className="border">Edit</th>
                  <th className="border">Delete</th>
                </tr>
              </thead>
              <tbody>
                {postList && postList.map((item: Post) => {
                  return (
                    <tr className="text-center border" key={item._id}>
                      <td className="border w-1/2 my-10 py-10">{item.title}</td>
                      <td className="border w-1/5">{item.category}</td>
                      <td className="border">
                        <button className="bg-white text-black font-bold px-4 py-2 rounded-full" onClick={() => { editAPostFunction(item._id); { setpostId(item._id); } }}>Edit</button>
                      </td>
                      <td className="border">
                        <button className="bg-white text-black font-bold px-4 py-2 rounded-full" onClick={() => { deleteAPostFunction(item._id); getPostList(); }}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </main>
        </>
      )}

      {addPost &&
        <>
          <main className="mt-5 ml-5">
            <button className={`${buttonCSS}`} onClick={() => { setaddPost(false); setinitialPage(true); }}> Back </button>

            <div className="flex items-center gap-5 mt-5">
              Title:
              <input value={postTitle} onChange={(e) => setpostTitle(e.target.value)} className="text-black w-1/2" type="text" name="" id="" />
            </div>

            <div className="flex items-center gap-5 mt-5">
              postCategory:
              <input value={postCategory} onChange={(e) => setpostCategory(e.target.value)} className="text-black w-1/2" type="text" name="" id="" />
            </div>

            <div className="gap-5 mt-5">
              Description:
              <EditorComponent onpostDescriptionChange={handlepostDescriptionChange} />
            </div>

            <button className="bg-white text-black font-bold rounded-full px-4 py-2 my-4" onClick={() => { addAPostFunction(); getPostList(); }}> SUBMIT </button>

          </main>
        </>
      }

      {editPost &&
        <main className="mt-5 ml-5">
          <button className={`${buttonCSS}`} onClick={() => { resetStrings(); seteditPost(false); setinitialPage(true); }}> Back </button>

          <div className="flex items-center gap-5 mt-5">
            Title:
            <input value={postTitle} onChange={(e) => setpostTitle(e.target.value)} className="text-black w-1/2" type="text" name="" id="" />
          </div>

          <div className="flex items-center gap-5 mt-5">
            postCategory:
            <input value={postCategory} onChange={(e) => setpostCategory(e.target.value)} className="text-black w-1/2" type="text" name="" id="" />
          </div>

          <div className="gap-5 mt-5">
            Description:
            <EditorComponent initialContent={postDescription} onpostDescriptionChange={handlepostDescriptionChange} />
          </div>

          <button className="bg-white text-black font-bold rounded-full px-4 py-2 my-4" onClick={updatePost}> UPDATE </button>

        </main>
      }

    </>
  );
}