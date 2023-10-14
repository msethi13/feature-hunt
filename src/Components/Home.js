import { useEffect, useState } from 'react';
import ProductTile from './ProductTile';
import Service from '../Service';
import { useHistory, useLocation } from 'react-router-dom';
//
//       Component: Home
//       Description: This component is the homepage which contains all the projects
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const Home = ({query,setQuery}) => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [products, setProducts] = useState([]);
  const history = useHistory();
  useEffect(() => {
    Service.get('products', "query=" + query).then(products => setProducts(products));
  }, [query]);

  const goTo = (page) => () => {
    setQuery('')
    history.push('/' + page);
  };

  return (
    <div className="container">
      <div className="child">
        <div className='product-title' onClick={goTo('')}>All Products</div>
        <div className="product-title">
          <h3 data-testid="home_header">PRODUCTS</h3>
          <div className="sort">
            <p 
            className={sortBy === 'votes' ? 'highlight' : ''}
            data-testid="home_sortpop"
            onClick={() => setSortBy('votes')}>POPULAR
            </p>
            <p> | </p>
            <p 
            className={sortBy === 'timestamp' ? 'highlight' : ''} 
            data-testid="home_sorttime"
            onClick={() => setSortBy('timestamp')}>LATEST
            </p>
          </div>
        </div>
      </div>
      {products
      .map((p, index) => { p['index'] = index; return p; })
      .sort((p1, p2) => p2[sortBy] - p1[sortBy])
      .map((product) => <ProductTile key={product.id} products={products} index={product.index} setProducts={setProducts} />, setProducts)
      }
    </div>
  );
};

export default Home;
