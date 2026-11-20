import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchPosts,addPost,setCategory,markResolved } from "./features/postSlice";


function App() {

    const dispatch = useDispatch();

    const { posts, selectedCategory, loading, error } =
        useSelector((state) => state.posts);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Request");
    const [category, setPostCategory] = useState("Food");


    // GET POSTS WHEN PAGE LOADS

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);


    // ADD POST

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            return;
        }

        dispatch(addPost({
            title,
            description,
            type,
            category
        }));

        setTitle("");
        setDescription("");
    };


    // FILTER POSTS

    const filteredPosts = posts.filter((post) => {

        return selectedCategory === "All" ||
            post.category === selectedCategory;

    });


    return (

        <div className="container">

            <h1>Community Help Board</h1>

            <p>Help your community!</p>


             <form onSubmit={handleSubmit}>

                <h2>Create a Post</h2>

                <input
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="Request">Request Help</option>
                    <option value="Offer">Offer Help</option>
                </select>

                <select
                    value={category}
                    onChange={(e) => setPostCategory(e.target.value)}
                >
                    <option value="Food">Food</option>
                    <option value="Education">Education</option>
                    <option value="Transport">Transport</option>
                    <option value="Household">Household</option>
                    <option value="Other">Other</option>
                </select>

                <button type="submit">Publish Post</button>

            </form>


            <h2>Community Posts</h2>


            {/* CATEGORY FILTER */}

            <div className="categories">

                {["All", "Food", "Education", "Transport",
                  "Household", "Other"].map((item) => (

                    <button
                        key={item}
                        onClick={() => dispatch(setCategory(item))}
                    >
                        {item}
                    </button>

                ))}

            </div>


            {/* LOADING */}

            {loading && <p>Loading posts...</p>}

            {error && <p>Error: {error}</p>}


            {/* DISPLAY POSTS */}

            <div className="post-container">

                {filteredPosts.map((post) => (

                    <div className="post-card" key={post.id}>

                        <h3>{post.title}</h3>

                        <p>{post.description}</p>

                        <p>Type: {post.type}</p>

                        <p>Category: {post.category}</p>

                        <p>
                            Status: {post.resolved ? "Resolved" : "Open"}
                        </p>

                        {!post.resolved && (

                            <button
                                onClick={() => dispatch(markResolved(post.id))}
                            >
                                Mark Resolved
                            </button>

                        )}

                    </div>

                ))}

            </div>

        </div>

    );
}

export default App;
