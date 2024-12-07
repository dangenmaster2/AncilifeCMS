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

function CreateMeditationLessons() {
    const context = useContext(myContext);
    const {getMeditaionType, mode } = context;

    const [lesson, setLesson] = useState({
        background: '',
        classContent: '',
        classImg: '',
        classTitle: ''
    })

    const [color, setColor] = useState("#aabbcc");
    const [thumbnail, setthumbnail] = useState();
    const [meditationType, setMeditationType] = useState('');

    const [text, settext] = useState('');

    const addPost = async () => {
        if (lesson.classContent === '' && lesson.classImg === '') {
            toast.error('Please Fill All Fields');
        }
        // console.log(blogs.content)
        else uploadImage()
    }

    const uploadImage = async () => {
        if (!thumbnail) return;
        const imageRef = ref(storage, `meditationLessonsImage/${thumbnail.name}`);
    
        // Step 1: Upload the image
        uploadBytes(imageRef, thumbnail).then((snapshot) => {
            // Step 2: Get the image URL after upload
            getDownloadURL(snapshot.ref).then(async (url) => {
                try {
                    const q = query(
                        collection(fireDb, "meditationLessons"),
                        where("meditationId", "==", meditationType)
                    );
                    const querySnapshot = await getDocs(q);
    
                    querySnapshot.forEach(async (docSnapshot) => {
                        const docRef = doc(fireDb, "meditationLessons", docSnapshot.id);
                        const lessonObj = {...lesson, background: color, classImg: url};

                        const docData = docSnapshot.data();
                        const existingLessonObj = docData.lessonObj || {};

                        const updatedLessonObj = {
                            ...existingLessonObj,
                            [`lesson${Object.keys(existingLessonObj).length + 1}`]: lessonObj
                        };

                        await updateDoc(docRef, {
                            lessonObj: updatedLessonObj,
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

    //* Create markup function 
    function createMarkup(c) {
        return { __html: c };
    }

    return(
        <div className=' container mx-auto max-w-5xl py-6'>
            <div className="p-5" style={{
                background: mode === 'dark'
                    ? '#353b48'
                    : 'rgb(226, 232, 240)',
                borderBottom: mode === 'dark'
                    ? ' 4px solid rgb(226, 232, 240)'
                    : ' 4px solid rgb(30, 41, 59)'
            }}>
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
                            Create Meditation Lessons
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
                        onChange={(e) => setLesson({ ...lesson, classTitle: e.target.value })} 
                        value={lesson.classTitle}
                    />
                </div>

                <div className='text-lg font-bold'>Create Meditation class</div>        
                <Editor
                    apiKey='9jo3lu73p1xbfqaw6jvgmsbrmy7qr907nqeafe1wbek6os9d'
                    onEditorChange={(newValue, editor) => {
                        setLesson({ ...lesson, classContent: newValue });
                        settext(editor.getContent({ format: 'text' }));
                    }}
                    onInit={(evt, editor) => {
                        settext(editor.getContent({ format: 'text' }));
                    }}
                    init={{
                        plugins: ' advlist anchor autolink autoresize autosave charmap code codesample directionality emoticons fullscreen help image importcss insertdatetime link linkchecker lists media nonbreaking pagebreak preview quickbars save searchreplace table template  tinydrive visualblocks visualchars wordcount'
                    }}
                />



                <div className="mb-3">
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

export default CreateMeditationLessons;