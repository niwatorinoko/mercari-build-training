import { useEffect, useState } from 'react';
import { Item, fetchItems } from '~/api';

const PLACEHOLDER_IMAGE = import.meta.env.VITE_FRONTEND_URL + '/logo192.png';

interface Prop {
  reload: boolean;
  onLoadCompleted: () => void;
}

export const ItemList = ({ reload, onLoadCompleted }: Prop) => {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const fetchData = () => {
      fetchItems()
        .then((data) => {
          console.debug('GET success:', data);
          setItems(data.items);
          onLoadCompleted();
        })
        .catch((error) => {
          console.error('GET error:', error);
        });
    };

    if (reload) {
      fetchData();
    }
  }, [reload, onLoadCompleted]);

  return (
<div>
      {items?.map((item) => {
        const imageUrl = item.image_name
          ? `http://localhost:9000/images/${item.image_name}`
          : PLACEHOLDER_IMAGE;

        return (
          <div key={item.id} className="ItemList">
            <img 
              src={imageUrl} 
              alt={item.name} 
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }} 
            />
            <p>
              <span>Name: {item.name}</span>
              <br />
              <span>Category: {item.category_name}</span>
            </p>
          </div>
        );
      })}
    </div>
  );  
};
