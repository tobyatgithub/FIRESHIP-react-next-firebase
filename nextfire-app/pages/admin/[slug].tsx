import styles from '../../styles/Admin.module.css';
import MetaTags from "@/components/Metatags"
import AuthCheck from '@/components/AuthCheck';
import { firestore, auth, serverTimestamp } from '@/lib/firebase';
import ImageUploader from '@/components/ImageUploader';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPostEdit({ }) {
    return (
        <main>
            <MetaTags title="Admin Page" />
            <AuthCheck>
                <PostManager />
            </AuthCheck>
        </main>
    )
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const [post] = useDocumentData(postRef); // listen to the post in real time
    // const [post] = useDocumentDataOnce(postRef); // listen to the post in only once might make more sense here.

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className='btn-blue'>Live view</button>
                        </Link>
                    </aside>
                </>)}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    // watch: will treat the thing as a state, and will update the thing when it changes.
    const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });
    // register is used to connect user input with form.

    // TOBY: notice the errors have been moved inside formState from useForm().
    const { isValid, isDirty, errors } = formState;

    const updatePost = async ({ content, published }) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });
        toast.success('Post updated successfully!');
    };
    
    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader/>
                <textarea {...register("content", {
                // <textarea name="content" {...register("content", {
                    required: { value: true, message: "content is required" },
                    maxLength: { value: 20000, message: "Max length is 20000 characters" },
                    minLength: { value: 10, message: "content is too short" },
                })}>
                </textarea>

                {/* note: content = the name of"content" defined in textarea above.*/}
                {errors.content && <p className="text-danger">{errors.content.message}</p>}

                <fieldset>
                    {/* <input className={styles.checkbox} name="published" type="checkbox" {...register("published", { required: "Required" })} /> */}
                    <input className={styles.checkbox} type="checkbox" {...register("published", { required: "Required" })} />
                    <label>Published</label>
                </fieldset>

                <button type="submit" disabled={!isDirty || !isValid} className='btn-green'>Save Changes</button>
            </div>
        </form>
    )
}
