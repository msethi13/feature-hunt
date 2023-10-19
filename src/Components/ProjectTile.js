import Button from '@mui/material/Button';
import Service from '../Service';
import {useHistory} from 'react-router';
//
//       Component: ProductTile
//       Description: This component wraps the project in its separate box with an upvote and downvote.
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const ProjectTile = ({products, index, setProducts}) => {
  const history = useHistory();
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const deleteDiv = (id) => {
    const el = document.getElementById(id);
    Service.remove('/' + id + '/delete').then((data) => {
      if (data) el.remove();
    });
  };
  const goTo = (product) => () => {
    history.push(`/${product}/getFeature`);
  };

  return (
    <div className="child product" id={products[index].uid}>
      <div className="product-container">
        <div className="image-container">
          <img src={products[index].image_url} alt={products[index].name} />
        </div>
        <div className="content">
          <div className="product-content">
            <span
              className="product-title"
              data-testid={'ptnav:' + index}
              style={{marginTop: 'auto', marginBottom: 'auto'}}
              onClick={goTo(products[index].name)}
            >
              {capitalizeFirstLetter(products[index].name)}
            </span>
            <p className="product-description">{products[index].description}</p>
          </div>
          <div className="tag-container">
            {products[index]['tags'].map((tag) => (
              <div key={tag}>
                <span className="tag">{tag.toUpperCase()}</span>
                <div>&nbsp;</div>
              </div>
            ))}
          </div>
          <div className="tag-container">
            views : {products[index].views ? products[index].views.length : 0}
          </div>
        </div>
        <br />
        <div
          id="delete_button"
          className="delete_project"
          style={{marginLeft: '25px'}}
        >
          <Button
            variant="text"
            style={{color: '#218888'}}
            onClick={() => deleteDiv(products[index].uid)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTile;
