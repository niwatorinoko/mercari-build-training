import { useEffect, useState } from 'react';
import { Item, fetchItems, fetchSearchItems } from '~/api';

const PLACEHOLDER_IMAGE = import.meta.env.VITE_FRONTEND_URL + '/logo192.png';
const SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:9000';

interface Prop {
  reload: boolean;
  onLoadCompleted: () => void;
}

export const ItemList = ({ reload, onLoadCompleted }: Prop) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

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

  const handleSearch = async () => {
    try {
      const data = await fetchSearchItems(searchKeyword);
      setItems(data.items);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div>
      <div className="SearchBar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search for items..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="ItemList">
        {items?.map((item) => {
          const imageUrl = item.image_name
            ? `${SERVER_URL}/images/${item.image_name}`
            : PLACEHOLDER_IMAGE;

          return (
            <p key={item.id} className="ItemCard">
              <img 
                src={imageUrl} 
                alt={item.name} 
                className="ItemImage"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }} 
              />
              <p className="ItemInfo">
                <span className="ItemName">{item.name}</span>
                <br />
                <span className='ItemCategory'>Category: {item.category_name}</span>
              </p>
            </p>
          );
        })}
      </div>
    </div>
  );  
};
