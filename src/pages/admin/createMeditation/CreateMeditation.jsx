import React, { useState, useContext, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import myContext from '../../../context/data/myContext';
import { Link, useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import {
    Button,
    Typography,
} from "@material-tailwind/react";
import { Timestamp, addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';

function CreateMeditation() {
    const context = useContext(myContext);
    const {getMeditaionType, mode } = context;

    const [meditation, setMeditation] = useState({
        description: '',
        lockedState: true,
        mainTitle: '',
    })
    const [color, setColor] = useState("#aabbcc");
    const [thumbnail, setthumbnail] = useState();
    const meditationLockedValues = ['true', 'false'];
    const [meditationType, setMeditationType] = useState('');
    const [isMeditationLocked, setIsMeditationLocked] = useState(false);

    useEffect(() =>{
        console.log('new meditation type is ', meditationType);
        
    }, [meditationType])

    const addPost = async () => {
        if (meditation.description === "" || meditation.mainTitle === "") {
            toast.error('Please Fill All Fields');
        }
        // console.log(blogs.content)
        uploadImage()
    }

    const uploadImage = async () => {
        if (!thumbnail) return;
        const imageRef = ref(storage, `meditationImage/${thumbnail.name}`);
    
        // Step 1: Upload the image
        uploadBytes(imageRef, thumbnail).then((snapshot) => {
            // Step 2: Get the image URL after upload
            getDownloadURL(snapshot.ref).then(async (url) => {
                try {
                    const q = query(
                        collection(fireDb, "meditationData"),
                        where("meditationId", "==", meditationType)
                    );
                    const querySnapshot = await getDocs(q);
    
                    querySnapshot.forEach(async (docSnapshot) => {
                        const docRef = doc(fireDb, "meditationData", docSnapshot.id);
    
                        await updateDoc(docRef, {
                            meditation,
                            backgroundColor: color,
                            thumbnail: url,
                            time: Timestamp.now(),
                            date: new Date().toLocaleString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                }
                            )
                        });
    
                    });
    
                    // navigate('/dashboard');
                    toast.success('updated the meditation type successfully');
    
                } catch (error) {
                    toast.error("Error: " + error.message);
                    console.log("Error adding/updating document:", error);
                }
            });
        });
    };

    const [text, settext] = useState('');
    function createMarkup(c) {
        return { __html: c };
    }

    return (
        <div className=' container mx-auto max-w-5xl py-6'>
            <div className="p-5" style={{
                background: mode === 'dark'
                    ? '#353b48'
                    : 'rgb(226, 232, 240)',
                borderBottom: mode === 'dark'
                    ? ' 4px solid rgb(226, 232, 240)'
                    : ' 4px solid rgb(30, 41, 59)'
            }}>
                {/* Top Item  */}
                <div className="mb-2 flex justify-between">
                    <div className="flex gap-2 items-center">
                        {/* Dashboard Link  */}
                        <Link to={'/dashboard'}>
                            <BsFillArrowLeftCircleFill size={25} />
                        </Link>

                        {/* Text  */}
                        <Typography
                            variant="h4"
                            style={{
                                color: mode === 'dark'
                                    ? 'white'
                                    : 'black'
                            }}
                        >
                            Create Meditation Type
                        </Typography>
                    </div>
                </div>

                {/* main Content  */}
                <div>Select MeditationType</div>
                    <div className="mb-3">
                        <div className="relative w-full lg:max-w-sm">
                    <select 
                    onChange={(e) => {
                        setMeditationType(e.target.value);
                        } 
                    }
                    className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                    {getMeditaionType.map((category,index) => (
                        <option key={index}>{category}</option>
                    ))}
                    </select>
                    </div>
                </div>
                
                <div className="mb-3">
                    <div className='text-lg font-bold'>Meditation Main Title</div>
                    <input
                        label="Enter Meditation Title"
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${mode === 'dark'
                 ? 'placeholder-black'
                 : 'placeholder-black'}`}
                        placeholder="Enter Meditation Title"
                        style={{
                            background: mode === 'dark'
                                ? '#dcdde1'
                                : 'rgb(226, 232, 240)'
                        }}
                        name="mainTitle"
                        onChange={(e) => setMeditation({ ...meditation, mainTitle: e.target.value })} 
                        value={meditation.mainTitle}
                    />
                </div>
                
                <div className="mb-3">
                <div className='text-lg font-bold'>Meditation Description</div>
                    <input
                        label="Enter Meditation description"
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${mode === 'dark'
                 ? 'placeholder-black'
                 : 'placeholder-black'}`}
                        placeholder="Enter Meditation Description"
                        style={{
                            background: mode === 'dark'
                                ? '#dcdde1'
                                : 'rgb(226, 232, 240)'
                        }}
                        name="meditationDescription"
                        onChange={(e) => setMeditation({ ...meditation, description: e.target.value })} 
                        value={meditation.description}
                    />
                </div>
                <div>Is this Meditation type locked?</div>
                    <div className="mb-3">
                        <div className="relative w-full lg:max-w-sm">
                    <select 
                    onChange={(e) => setMeditation({ ...meditation, lockedState: e.target.value === 'true' ? true : false })}
                    className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                    {meditationLockedValues.map((category,index) => (
                        <option key={index}>{category}</option>
                    ))}
                    </select>
                    </div>
                </div>

                <div className="mb-3">
                    Thumbnail 
                    {thumbnail && <img className=" size-24 "
                        src={thumbnail
                            ? URL.createObjectURL(thumbnail)
                            : ""}
                        alt="thumbnail"
                    />}

                    {/* Text  */}
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-semibold"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                        Upload Meditation Image
                    </Typography>

                    {/* First Thumbnail Input  */}
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
                </div>

                <div>
                    <div className="mb-2 font-semibold">Choose the background color of the meditation tiles</div>
                    <div style={{
                        backgroundColor: `${color}`, 
                        borderRadius: '2rem', 
                        margin: '1rem',
                        paddingLeft: '4rem'
                        }} className='h-10 w-10'>

                    </div>
                    <HexColorPicker color={color} onChange={setColor} />;
                </div>

                {/* Five Submit Button  */}
                <Button className=" w-full mt-5"
                onClick={addPost}
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
    )
}

export default CreateMeditation;