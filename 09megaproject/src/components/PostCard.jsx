import React, { useEffect } from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featureimage }) {
  useEffect(() => {
    console.log('PostCard:', { $id, title, featureimage });
  }, [$id, title, featureimage]);

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          {featureimage ? (
            <img
              src={appwriteService.getFilePreview(featureimage)}
              alt={title}
              className="rounded-xl"
              onError={(e) => {
                e.target.onerror = null; // Prevent looping if broken image
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
