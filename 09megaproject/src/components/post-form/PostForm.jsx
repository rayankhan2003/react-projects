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
        featuredImage: [],
        status: 'active',
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    console.log(data);
    const file = await appwriteService.uploadFile(data.featureimage[0]);
    try {
      if (file) {
        const fileId = file.$id;
        data.featureimage = fileId;
        console.log('User data ID: ', userData.$id);
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (error) {
      console.log(error);
      await appwriteService.deleteFile(file.$id);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string')
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, '-');

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
          {...register('featuredImage', { required: true })}
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
