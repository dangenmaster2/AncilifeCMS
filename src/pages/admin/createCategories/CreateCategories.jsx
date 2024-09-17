import React, { useState, useContext, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';
import myContext from '../../../context/data/myContext';
import { Button } from '@material-tailwind/react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

function CreateCategory () {
  const context = useContext(myContext);
  const { mode } = context;

  const [thumbnail, setthumbnail] = useState();
  const [category, setCategory] = useState('');

  const uploadImage = () => {
    if (!thumbnail) return;
    const imageRef = ref(storage, `categoryImage/${thumbnail.name}`);
    uploadBytes(imageRef, thumbnail).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const productRef = collection(fireDb, "availableCategories");
        try {
          addDoc(productRef, {
            category,
            thumbnail: url,
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
          });
          toast.success('Category added successfully');
        } catch (error) {
          toast.error(error.message || 'An error occurred');  // Use error.message instead of passing the whole error object
          console.log(error);
        }
      });
    });
  };  
  
  return (
    <div className="flex justify-center h-screen m-6">
      <div className="text-1xl font-bold text-blue-500">
      <input
                        type="file"
                        label="Upload thumbnail"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
                        style={{
                            background: mode === 'dark'
                                ? '#dcdde1'
                                : 'rgb(226, 232, 240)'
                        }}
                        onChange={(e) => setthumbnail(e.target.files[0])}
                    />
      <input onChange={(e) => setCategory(e.target.value)} type="text" id="first_name" class="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="category name" required />
      <Button className=" w-full mt-5"
                onClick={uploadImage}
                    style={{
                        background: mode === 'dark'
                            ? 'rgb(226, 232, 240)'
                            : 'rgb(30, 41, 59)',
                        color: mode === 'dark'
                            ? 'rgb(30, 41, 59)'
                            : 'rgb(226, 232, 240)'
                    }}
                >
                    Send
                </Button>
      </div>
    </div>
  );
}

export default CreateCategory;
