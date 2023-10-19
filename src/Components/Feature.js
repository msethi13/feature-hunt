import React, {useState} from 'react';
import {ReactSession} from 'react-client-session';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {Button, TextField} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Service from '../Service';
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min';

//
//       Component: Feature
//       Description: This component is the specific feature which has the up and down votes
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const Feature = ({
  features,
  index,
  setFeatures,
  editable,
  setTimeline,
  productId,
}) => {
  console.log(productId);
  const username = ReactSession.get('username');
  const loggedin = username !== '' && username !== undefined ? true : false;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const increaseVote = () => {
    const form = new FormData();
    form.append('featureId', features[index].id);
    form.append('productId', productId);
    form.append('isAdd', 1);
    console.log('in increase vote');
    Service.post('finalFeatureVote', form).then((data) => {
      if (data.success) {
        const updatedFeature = {...features[index]};
        updatedFeature.votes = updatedFeature.votes + 1;
        console.log('VOTE:' + updatedFeature.votes);
        setFeatures(
          features.map((feature, index) =>
            updatedFeature.id === features[index].id ? updatedFeature : feature
          )
        );
      }
      /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
    });
  };
  const handleUpvote = () => {
    const form = new FormData();
    form.append('emailId', username);
    form.append('productId', productId);
    form.append('featureId', features[index].id);
    Service.post('upvoteFeature', form).then((data) => {
      if (data.success) {
        increaseVote();
      }
      /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
    });
  };

  const decreaseVote = () => {
    const form = new FormData();
    form.append('featureId', features[index].id);
    form.append('productId', productId);
    form.append('isAdd', 0);
    console.log('in decrease vote');
    Service.post('finalFeatureVote', form).then((data) => {
      if (data.success) {
        const updatedFeature = {...features[index]};
        updatedFeature.votes = updatedFeature.votes - 1;
        console.log('VOTE:' + updatedFeature.votes);
        setFeatures(
          features.map((feature, index) =>
            updatedFeature.id === features[index].id ? updatedFeature : feature
          )
        );
      }
      /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
    });
  };
  const handleDownvote = () => {
    const form = new FormData();
    form.append('emailId', username);
    form.append('productId', productId);
    form.append('featureId', features[index].id);
    Service.post('downvoteFeature', form).then((data) => {
      if (data.success) {
        decreaseVote();
      }
      /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
    });
  };

  // const upVote = () => {
  //   const updatedFeature = { ...features[index] };
  //   let currentVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
  //   updatedFeature.upVoted = !updatedFeature.upVoted;
  //   updatedFeature.downVoted = false;
  //   let newVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
  //   updatedFeature.votes = updatedFeature.votes - currentVote + newVote;
  //   setFeatures(features.map((feature) => feature.id === features[index].id ? updatedFeature : feature));
  // };
  // const downVote = () => {
  //   const updatedFeature = { ...features[index] };
  //   let currentVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
  //   updatedFeature.downVoted = !updatedFeature.downVoted;
  //   updatedFeature.upVoted = false;
  //   let newVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
  //   updatedFeature.votes = updatedFeature.votes - currentVote + newVote;
  //   setFeatures(features.map((feature) => feature.id === features[index].id ? updatedFeature : feature));
  // };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [newTag, setNewTag] = useState('');

  const handleTextChange = (e) => {
    setNewTag(e.target.value);
  };
  const handleButtonClick = () => {
    const form = new FormData();
    form.append('feature_id', features[index].id);
    Service.post(window.location.pathname + '/addToTimeline', form).then(
      (data) => {
        if (data) {
          console.log(data);
          setTimeline(data);
        }
      }
    );
  };

  /* TODO : save new tag to database */
  const addNewTag = () => {
    features[index]['tags'].push(newTag);
    const form = new FormData();
    form.append('features', JSON.stringify(features));
    Service.post(window.location.pathname + '/features', form).then(
      (data) => {}
    );
    setNewTag('');
  };
  const history = useHistory();
  const goTo = (featureID) => () => {
    history.push('/' + productId + '/' + featureID + '/forum');
  };

  return (
    <div className="child feature">
      <div className="feature-container">
        <div className="content">
          <div
            className="feature-content"
            data-testid={'feature_content:' + features[index].id}
          >
            <span style={{marginTop: 'auto', marginBottom: 'auto'}}>
              {capitalizeFirstLetter(features[index].text)}
            </span>
            <div
              className="tag-container"
              data-testid={'feature_tag_container:' + features[index].id}
              style={{marginBottom: '25px'}}
            >
              {features[index]['tags'].map((tag) => (
                <span key={tag} className="tag">
                  {tag.toUpperCase()}
                </span>
              ))}

              {editable && (
                <div>
                  {/* <TextField
                data-testid={"feature_addtag:"+ features[index].id}
                label="Add New Tag"
                inputProps={{ "data-testid": "newTag-input:" + features[index].id }}
                value={newTag}
                size="small"
                onChange={handleTextChange}
              /> */}
                  {/* <Button 
              data-testid={"feature_tagbutton:" + features[index].id}
              onClick={addNewTag}>Add</Button>  */}
                </div>
              )}
            </div>
          </div>

          <div className="button-container">
            {editable && (
              <>
                <Button
                  size="small"
                  onClick={handleButtonClick}
                  variant="outlined"
                  style={{
                    color: '#218888',
                    borderColor: '#218888',
                    marginRight: '5px',
                  }}
                >
                  Add to timeline
                </Button>
              </>
            )}
            <Button
              size="small"
              onClick={goTo(features[index].id)}
              variant="outlined"
              style={{color: '#218888', borderColor: '#218888'}}
            >
              View Comments
            </Button>
          </div>
        </div>

        <div
          className="votes-container"
          style={{display: 'flex', alignItems: 'center'}}
        >
          <span>
            <FontAwesomeIcon
              icon={faChevronUp}
              size="lg"
              className={features[index].upVoted ? 'votedUp' : 'voteup'}
              data-testid={'feature_upvote:' + features[index].id}
              onClick={loggedin ? handleUpvote : handleClickOpen}
            />
          </span>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{style: {minWidth: '400px'}}}
          >
            <DialogTitle>Action Required</DialogTitle>
            <DialogContent>
              <DialogContentText>Please login to vote!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
          </Dialog>
          <span data-testid={'fvoteval:' + features[index].id}>
            {features[index].votes}
          </span>
          <span>
            <FontAwesomeIcon
              icon={faChevronDown}
              size="lg"
              className={features[index].downVoted ? 'votedDown' : 'votedown'}
              data-testid={'feature_downvote:' + features[index].id}
              onClick={loggedin ? handleDownvote : handleClickOpen}
            />
          </span>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{style: {minWidth: '400px'}}}
          >
            <DialogTitle>Action Required</DialogTitle>
            <DialogContent>
              <DialogContentText>Please login to vote!</DialogContentText>
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

export default Feature;
