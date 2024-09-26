/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';

function PostCard({ $id, title, featureimage }) {
  useEffect(() => {
    console.log('PostCard:', { $id, title, featureimage });
  }, [$id, title, featureimage]);

  const imagePreviewUrl = featureimage
    ? appwriteService.getFilePreview(featureimage)
    : null;

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt={title}
              className="rounded-xl"
              onError={(e) => {
                e.target.src = '/path/to/default/image.jpg'; // Fallback image
              }}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
