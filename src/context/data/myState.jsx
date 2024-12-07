import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

function MyState(props) {
    const [mode, setMode] = useState('light'); // Whether dark mode is enabled or not
    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    }

    //* search state
    const [searchkey, setSearchkey] = useState('');

    //* loading state
    const [loading, setloading] = useState(false);

    //* getAllBlog State 
    const [getAllBlog, setGetAllBlog] = useState([]);

    const [getAllCategory, setGetAllCategory] = useState([]);

    const [getMeditaionType, setGetAllMeditationType] = useState([])

    //* getAllBlogs Function
    function getAllBlogs() {
        setloading(true);
        try {
            const q = query(
                collection(fireDb, "blogPost"),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let blogArray = [];
                QuerySnapshot.forEach((doc) => {
                    blogArray.push({ ...doc.data(), id: doc.id });
                });

                setGetAllBlog(blogArray)
                setloading(false)
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    function getAllCategories() {
        setloading(true);
        try {
            const q = query(
                collection(fireDb, "availableCategories"),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let categoriesArray = [];
                QuerySnapshot.forEach((doc) => {
                    categoriesArray.push({ ...doc.data(), id: doc.id });
                });

                setGetAllCategory(categoriesArray)
                setloading(false)
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    function getAllMeditationType () {
        setloading(true);
        try {
            const q = query(
                collection(fireDb, "availableMeditations")
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let meditationArray = [];
                QuerySnapshot.forEach((doc) => {
                    meditationArray.push({ ...doc.data(), id: doc.id });
                });

                setGetAllMeditationType(meditationArray[0]?.availableMeditations);
                console.log('meditations available ',meditationArray);
                setloading(false);
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    useEffect(() => {
        getAllBlogs();
        getAllCategories();
        getAllMeditationType();
    }, []);

    // Blog Delete Function 
    const deleteBlogs = async (id) => {
        try {
            await deleteDoc(doc(fireDb, "blogPost", id));
            getAllBlogs()
            toast.success("Blogs deleted successfully")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <MyContext.Provider value={{
            mode,
            toggleMode,
            searchkey,
            setSearchkey,
            loading,
            setloading,
            getAllBlog,
            getAllCategory,
            getMeditaionType,
            deleteBlogs
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MyState