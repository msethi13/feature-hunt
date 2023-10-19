import {useEffect, useState} from 'react';
import ProductTile from './ProductTile';
import Service from '../Service';

//
//       Component: Home
//       Description: This component is the homepage which contains all the projects
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const Home = ({query}) => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState('');
  const [numberOfProducts, setNumberOfProducts] = useState(0);

  const findTopProducts = (products) => {
    const topProducts = [];
    products.forEach((product) => {
      topProducts.push([product.views.length, product.name]);
      topProducts.sort((a, b) => b[0] - a[0]);
    });
    console.log(topProducts);
    return [topProducts[0][1], topProducts[1][1], topProducts[2][1]];
  };

  useEffect(() => {
    Service.get('products', 'query=' + query).then((products) => {
      setProducts(products);
      const numProducts = products.length;
      setNumberOfProducts(numProducts);
      if (products.length >= 3) {
        setTopProducts(findTopProducts(products));
      }
    });
  }, [query]);

  if (numberOfProducts >= 3) {
    return (
      <div className="container">
        <div className="row" style={{display: 'flex'}}>
          <div className="left-column" style={{width:'70%'}}>
            <div className="child">
              <div className="product-title">
                <h3 data-testid="home_header">PRODUCTS</h3>
                <div className="sort">
                  <p
                    className={sortBy === 'votes' ? 'highlight' : ''}
                    data-testid="home_sortpop"
                    onClick={() => setSortBy('votes')}
                  >
                    POPULAR
                  </p>
                  <p> | </p>
                  <p
                    className={sortBy === 'timestamp' ? 'highlight' : ''}
                    data-testid="home_sorttime"
                    onClick={() => setSortBy('timestamp')}
                  >
                    LATEST
                  </p>
                </div>
              </div>
              {products
                .map((p, index) => {
                  p['index'] = index;
                  return p;
                })
                .sort((p1, p2) => p2[sortBy] - p1[sortBy])
                .map((product) => (
                  <ProductTile
                    key={product.id}
                    products={products}
                    index={product.index}
                    setProducts={setProducts}
                  />
                ))}
            </div>
          </div>

          <div className="right-column" style={{ width: '20%' }}>
  <div style={{ position: 'sticky', top: '20px' }}>
    <p style={{ color: 'teal', fontWeight: 'bold' }}>TOP PRODUCTS</p>
    <div className="row">
      <p style={{ fontWeight: 'bold' }}>{topProducts[0]}</p>
    </div>
    <div className="row">
      <p style={{ fontWeight: 'bold' }}>{topProducts[1]}</p>
    </div>
    <div className="row">
      <p style={{ fontWeight: 'bold' }}>{topProducts[2]}</p>
    </div>
  </div>
</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="row" style={{display: 'flex'}}>
          <div className="left-column" style={{}}>
            <div className="child">
              <div className="product-title">
                <h3 data-testid="home_header">PRODUCTS</h3>
                <div className="sort">
                  <p
                    className={sortBy === 'votes' ? 'highlight' : ''}
                    data-testid="home_sortpop"
                    onClick={() => setSortBy('votes')}
                  >
                    POPULAR
                  </p>
                  <p> | </p>
                  <p
                    className={sortBy === 'timestamp' ? 'highlight' : ''}
                    data-testid="home_sorttime"
                    onClick={() => setSortBy('timestamp')}
                  >
                    LATEST
                  </p>
                </div>
              </div>
              {products
                .map((p, index) => {
                  p['index'] = index;
                  return p;
                })
                .sort((p1, p2) => p2[sortBy] - p1[sortBy])
                .map((product) => (
                  <ProductTile
                    key={product.id}
                    products={products}
                    index={product.index}
                    setProducts={setProducts}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
