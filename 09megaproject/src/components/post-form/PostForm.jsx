import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, RTE, Select } from '../index.js';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm() {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: '',
        slug: '',
        content: '',
        featureimage: [],
        status: 'active',
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    console.log('Form data:', data);
    console.log('User data:', userData); // Log userData to debug if it's populated correctly

    // Check if userData and userData.$id exist before proceeding
    if (!userData || !userData.$id) {
      console.error('Error: User data or user ID is missing');
      return;
    }

    const file = await appwriteService.uploadFile(data.featureimage[0]);
    try {
      if (file) {
        const fileId = file.$id;
        data.featureimage = fileId;

        console.log('File uploaded successfully:', fileId);

        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id, // Ensure userData.$id is available
        });

        if (dbPost) {
          console.log('Post created successfully:', dbPost);
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (error) {
      console.error('Error during post creation:', error);
      if (file && file.$id) {
        await appwriteService.deleteFile(file.$id); // Clean up file in case of error
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string') {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, '-');
    }
    return '';
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title, { shouldValidate: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-full sm:w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register('title', { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          disabled
          {...register('slug', { required: true })}
          onInput={(e) => {
            setValue('slug', slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues('content')}
        />
      </div>
      <div className="w-full sm:w-1/3 px-2 my-8 sm:m-0">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4 w-full mt-2"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register('featureimage', { required: true })}
        />
        <Select
          options={['active', 'inactive']}
          label="Status"
          className="mb-4"
          {...register('status', { required: true })}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
