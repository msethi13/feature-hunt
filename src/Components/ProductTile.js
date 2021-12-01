import React from "react";
import { ReactSession } from "react-client-session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Service from "../Service";

//
//       Component: ProductTile
//       Description: This component wraps the project in its separate box with an upvote and downvote.
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const ProductTile = ({ products, index, setProducts }) => {
  const history = useHistory();

  const username = ReactSession.get("username");
  const loggedin = username !== ""?true:false;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const increaseUpVote = () => {
    const form = new FormData();
    form.append("uid", products[index].uid);
    Service.post("addTotalVote", form)
      .then((data) => 
        {
          if(data.success)
          {
            const updatedProduct = { ...products[index] };
            updatedProduct.votes = updatedProduct.votes + 1;
            setProducts(products.map((product) => product.id === products[index].id ? updatedProduct : product));
          }
          /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
        });
  };
  const handleUpVote = () => {
    const form = new FormData();
    form.append("emailId", username);
    form.append("productId", index);
    Service.post("addVote", form)
      .then((data) => 
        {
          if(data.success)
          {
            increaseUpVote();
          }
          /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
        });
  };

  const decreaseUpVote = () => {
    const form = new FormData();
    form.append("uid", products[index].uid);
    Service.post("subTotalVote", form)
      .then((data) => 
        {
          if(data.success)
          {
            const updatedProduct = { ...products[index] };
            updatedProduct.votes = updatedProduct.votes - 1;
            setProducts(products.map((product) => product.id === products[index].id ? updatedProduct : product));
          }
          /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
        });
  };
  const handleDownVote = () => {
    const form = new FormData();
    form.append("emailId", username);
    form.append("productId", index);
    Service.post("removeVote", form)
      .then((data) => 
        {
          if(data.success)
          {
            decreaseUpVote();
          }
          /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
        });
  };
  
  const goTo = (product) => () => {
    history.push(`/${product}/getFeature`);
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="child product">
      <div className="product-container">
        <div className="image-container">
          <img src={products[index].image_url} alt={products[index].name} />
        </div>
        <div className="content">
          <div className="product-content">
            <span className="product-title" 
            data-testid={"ptnav:"+index}
            onClick={goTo(products[index].name)} 
            style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              {capitalizeFirstLetter(products[index].name)}
            </span>
            <p className="product-description">
              {products[index].description}
            </p>
          </div>
          <div className="tag-container">
            {products[index]['tags'].map(tag =>
              <div key={tag}>
                <span className="tag">{tag.toUpperCase()}</span>
                <div>&nbsp;</div>
              </div>
            )}
          </div>
        </div>
        <div className="votes-container">
          <span>
            <FontAwesomeIcon icon={faChevronUp} size="lg" 
            className={products[index].upVoted ? 'votedUp' : 'voteup'} 
            data-testid={"pt_up:"+index}
            onClick={loggedin?handleUpVote:handleClickOpen} />
          </span>
          <Dialog  open={open} onClose={handleClose}>
          <DialogTitle >Thank you </DialogTitle>
          <DialogContent>
            <DialogContentText >
              Please login first for your vote to matter!
            </DialogContentText>
          </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
          </Dialog>
          <span>
            {products[index].votes}
          </span>
          <span>
            <FontAwesomeIcon icon={faChevronDown} 
            size="lg" 
            className={products[index].downVoted ? 'votedDown' : 'votedown'} 
            data-testid={"pt_down:"+index}
            onClick={loggedin?handleDownVote:handleClickOpen} />
          </span>
          <Dialog  open={open} onClose={handleClose}>
          <DialogTitle >Thank you </DialogTitle>
          <DialogContent>
            <DialogContentText >
              Please login first for your vote to matter!
            </DialogContentText>
          </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProductTile;
