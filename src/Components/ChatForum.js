import React, {useState, useEffect} from 'react';
import {ReactSession} from 'react-client-session';
import {useParams} from 'react-router-dom';
//import React from "react";
//import { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';
//import { ReactSession } from 'react-client-session';
import Service from '../Service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Comment from './Comment';

const ChatForum = () => {
  const {id1, id2} = useParams();
  const productId = id1;
  const featureId = id2;
  console.log('YO YO YO ');
  console.log(productId);
  console.log(featureId);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  //const [loggedInUser, setLoggedInUser] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  // Function to fetch comments from the API

  const addComment = (event) => {
    event.preventDefault();
    if (newComment === '') return;
    else {
      const addedComment = {
        productId: productId,
        comment: newComment,
        timestamp: Date.now(),
        email: ReactSession.get('username'),
        //commentor:,
      };
      const form = new FormData();
      form.append('comments', JSON.stringify(addedComment));
      Service.post('/' + productId + '/' + featureId + '/comment', form).then(
        (data) => {}
      );
      setComments(comments.concat(addedComment));
      setNewComment('');
    }
  };

  useEffect(() => {
    //console.log(window.location.pathname);
    Service.get('/' + productId + '/' + featureId + '/comment').then((data) => {
      //console.log(data)
      //setProductId(data[0] ? data[0].uid : '');
      setComments(data);
      console.log(comments);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const username = ReactSession.get('username');
  const loggedin = username !== '' && username !== undefined ? true : false;
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Function to add a new comment
  // const addComment = () => {
  //   if (newComment) {
  //     const newCommentObject = {
  //       id: comments.length + 1,
  //       name: loggedInUser,
  //       text: newComment,
  //       time: 'just now',
  //       likes: 0,
  //     };

  //     // Assuming you have an API endpoint to post a new comment
  //     fetch('your-add-comment-api-endpoint', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newCommentObject),
  //     })
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           console.error('Failed to add a new comment');
  //         }
  //       })
  //       .then((data) => {
  //         setComments([data, ...comments]);
  //         setNewComment('');
  //       })
  //       .catch((error) => {
  //         console.error('Error adding a new comment:', error);
  //       });
  //   }
  // };

  // Fetch comments and the logged-in user on component mount

  return (
    <div className="container">
      {/* <div className="child">
      <div className="product-title">
        <h3>{id.toUpperCase()}</h3>
        <div className="sort">
          <p className={sortBy === 'votes' ? 'highlight' : ''} data-testid="prod_sortpop" onClick={() => setSortBy('votes')}>POPULAR</p>
          <p> | </p>
          <p className={sortBy === 'timestamp' ? 'highlight' : ''} data-testid="prod_sorttime" onClick={() => setSortBy('timestamp')}>LATEST</p>
        </div>
      </div>
    </div> */}
      <div className="child inputContainer">
        <form data-testid="prod_form" onSubmit={addComment}>
          <input
            className="inputBar"
            data-testid="prod_input"
            value={newComment}
            onChange={loggedin ? handleNewCommentChange : handleClickOpen}
            placeholder="Enter Comment"
          ></input>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{style: {minWidth: '400px'}}}
          >
            <DialogTitle>Action Required</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please login to add a Comment!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
      <div className="main-content">
        <div className="features">
          {comments.map((comment, index) => {
            return <Comment comment={comment} index={index} />;
          })}
        </div>
      </div>
    </div>
    // <div className="chat-forum">
    //   <div className="comments-list">
    //     {comments.map((comment) => (
    //       <Comment
    //         key={comment.id}
    //         name={comment.name}
    //         text={comment.text}
    //         time={comment.time}
    //         likes={comment.likes}
    //         onLike={() => handleLike(comment.id)}
    //       />
    //     ))}
    //   </div>
    //   <div className="new-comment">
    //     <input
    //       type="text"
    //       placeholder="Add a new comment..."
    //       value={newComment}
    //       onChange={(e) => setNewComment(e.target.value)}
    //     />
    //     <button onClick={addComment}>Post</button>
    //   </div>
    // </div>
  );
};

export default ChatForum;

// import React, { useState } from 'react';
// import { ReactSession } from "react-client-session";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
// import { Button, TextField } from '@mui/material';
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import Service from '../Service';
// //
// //       Component: Feature
// //       Description: This component is the specific feature which has the up and down votes
// //
// //       Inputs:
// //           - NA
// //       Outputs:
// //          - NAF
// const Chat = ({ features, index, setFeatures, editable, setTimeline, productId}) => {

//

// //   const increaseVote = () => {
// //     const form = new FormData();
// //     form.append("featureId", features[index].id);
// //     form.append("productId", productId);
// //     form.append("isAdd", 1);
// //     console.log("in increase vote")
// //     Service.post("finalFeatureVote", form)
// //       .then((data) =>
// //         {
// //           if(data.success)
// //           {
// //             const updatedFeature = { ...features[index] };
// //             updatedFeature.votes = updatedFeature.votes + 1;
// //             console.log("VOTE:" + updatedFeature.votes);
// //             setFeatures(features.map((feature, index) => updatedFeature.id === features[index].id ? updatedFeature : feature));
// //           }
// //           /*if (data.code > 200) {
// //             console.log("Error");
// //           } else {
// //             console.log(data.success);
// //           }*/
// //         });
// //   };
// //   const handleUpvote = () => {
// //     const form = new FormData();
// //     form.append("emailId", username);
// //     form.append("productId", productId);
// //     form.append("featureId", features[index].id);
// //     Service.post("upvoteFeature", form)
// //       .then((data) =>
// //         {
// //           if(data.success)
// //           {
// //             increaseVote();
// //           }
// //           /*if (data.code > 200) {
// //             console.log("Error");
// //           } else {
// //             console.log(data.success);
// //           }*/
// //         });
// //   };

// //   const decreaseVote = () => {
// //     const form = new FormData();
// //     form.append("featureId", features[index].id);
// //     form.append("productId", productId);
// //     form.append("isAdd", 0);
// //     console.log("in decrease vote")
// //     Service.post("finalFeatureVote", form)
// //       .then((data) =>
// //         {
// //           if(data.success)
// //           {
// //             const updatedFeature = { ...features[index] };
// //             updatedFeature.votes = updatedFeature.votes - 1;
// //             console.log("VOTE:" + updatedFeature.votes);
// //             setFeatures(features.map((feature, index) => updatedFeature.id === features[index].id ? updatedFeature : feature));
// //           }
// //           /*if (data.code > 200) {
// //             console.log("Error");
// //           } else {
// //             console.log(data.success);
// //           }*/
// //         });
// //   };
// //   const handleDownvote = () => {
// //     const form = new FormData();
// //     form.append("emailId", username);
// //     form.append("productId", productId);
// //     form.append("featureId", features[index].id);
// //     Service.post("downvoteFeature", form)
// //       .then((data) =>
// //         {
// //           if(data.success)
// //           {
// //             decreaseVote();
// //           }
// //           /*if (data.code > 200) {
// //             console.log("Error");
// //           } else {
// //             console.log(data.success);
// //           }*/
// //         });
// //   };

//   // const upVote = () => {
//   //   const updatedFeature = { ...features[index] };
//   //   let currentVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
//   //   updatedFeature.upVoted = !updatedFeature.upVoted;
//   //   updatedFeature.downVoted = false;
//   //   let newVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
//   //   updatedFeature.votes = updatedFeature.votes - currentVote + newVote;
//   //   setFeatures(features.map((feature) => feature.id === features[index].id ? updatedFeature : feature));
//   // };
//   // const downVote = () => {
//   //   const updatedFeature = { ...features[index] };
//   //   let currentVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
//   //   updatedFeature.downVoted = !updatedFeature.downVoted;
//   //   updatedFeature.upVoted = false;
//   //   let newVote = updatedFeature.upVoted ? 1 : (updatedFeature.downVoted ? -1 : 0);
//   //   updatedFeature.votes = updatedFeature.votes - currentVote + newVote;
//   //   setFeatures(features.map((feature) => feature.id === features[index].id ? updatedFeature : feature));
//   // };

//   const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   };

//   const [newTag, setNewTag] = useState('');

//   const handleTextChange = (e) => {
//     setNewTag(e.target.value);
//   }
//   const handleButtonClick = () => {
//     const form = new FormData();
//     form.append("feature_id", features[index].id);
//     Service.post(window.location.pathname + "/addToTimeline", form).then(data => {
//       if(data){
//         console.log(data);
//         setTimeline(data);
//       }
//     });
//   }

//   /* TODO : save new tag to database */
//   const addNewTag = () => {
//     features[index]['tags'].push(newTag);
//     const form = new FormData();
//     form.append("features", JSON.stringify(features));
//     Service.post(window.location.pathname + "/features", form).then(data => {});
//     setNewTag('');
//   }

//   return (
//     <div className="child feature">
//       <div className="feature-container">
//         <div className="content">
//           <div className="feature-content" data-testid={"feature_content:"+features[index].id}>
//             <span style={{ marginTop: 'auto', marginBottom: 'auto' }}>
//               {capitalizeFirstLetter(features[index].text)}
//             </span>
//           </div>
//           <div className="tag-container" data-testid={"feature_tag_container:"+features[index].id}>
//             {features[index]['tags'].map(tag =>
//               <div key={tag}>
//                 <span className="tag" data-testid="feature_tag">{tag.toUpperCase()}</span>
//                 <div>&nbsp;</div>
//               </div>
//             )}
//             {editable &&
//             <div>
//               {/* <TextField
//                 data-testid={"feature_addtag:"+ features[index].id}
//                 label="Add New Tag"
//                 inputProps={{ "data-testid": "newTag-input:" + features[index].id }}
//                 value={newTag}
//                 size="small"
//                 onChange={handleTextChange}
//               /> */}
//               {/* <Button
//               data-testid={"feature_tagbutton:" + features[index].id}
//               onClick={addNewTag}>Add</Button>  */}
//             </div> }
//           </div>
//           <div className='button-container'>
//           {editable && <Button onClick={handleButtonClick}>
//             Add
//           </Button>}
//         </div>
//         </div>

//         <div className="votes-container">
//           <span>
//             <FontAwesomeIcon icon={faChevronUp}
//             size="lg"
//             className={features[index].upVoted ? 'votedUp' : 'voteup'}
//             data-testid={"feature_upvote:"+features[index].id}
//             onClick={loggedin?handleUpvote:handleClickOpen} />
//           </span>
//           <Dialog  open={open} onClose={handleClose} PaperProps={{ style: { minWidth: '400px' } }}>
//           <DialogTitle >Action Required</DialogTitle>
//           <DialogContent>
//             <DialogContentText >
//             Please login to vote!
//             </DialogContentText>
//           </DialogContent>
//             <DialogActions>
//               <Button onClick={handleClose}>Ok</Button>
//             </DialogActions>
//           </Dialog>
//           <span>
//           </span>
//           <span data-testid={"fvoteval:" + features[index].id}>
//             {features[index].votes}
//           </span>
//           <span>
//             <FontAwesomeIcon icon={faChevronDown}
//             size="lg"
//             className={features[index].downVoted ? 'votedDown' : 'votedown'}
//             data-testid={"feature_downvote:" + features[index].id}
//             onClick={loggedin?handleDownvote:handleClickOpen} />
//           </span>
//           <Dialog  open={open} onClose={handleClose} PaperProps={{ style: { minWidth: '400px' } }}>
//           <DialogTitle >Action Required</DialogTitle>
//           <DialogContent>
//             <DialogContentText >
//               Please login to vote!
//             </DialogContentText>
//           </DialogContent>
//             <DialogActions>
//               <Button onClick={handleClose}>Ok</Button>
//             </DialogActions>
//           </Dialog>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
