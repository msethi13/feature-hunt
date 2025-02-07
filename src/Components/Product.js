import React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ReactSession} from 'react-client-session';
import Feature from './Feature';
import Service from '../Service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Comments from './Comments';
import ProductTimeline from './Timeline';
import Timeline from '@mui/lab/Timeline';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

//       Component: Product
//       Description: This component allows the user to add specific features and
//       allows the user to upvote or downvote the features
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const Product = ({query}) => {
  const {id} = useParams();

  const username = ReactSession.get('username');
  const loggedin = username !== '' && username !== undefined ? true : false;
  const [featureName, setFeatureName] = React.useState('');
  const [featureCategory, setFeatureCategory] = React.useState('');
  const [loginCheck, setLoginCheck] = React.useState(false);
  const [featureForm, setFeatureForm] = React.useState(false);
  const [sortBy, setSortBy] = useState('votes');

  const loginCheckOpen = () => {
    setLoginCheck(true);
  };

  const loginCheckClose = () => {
    setLoginCheck(false);
  };

  const featureFormOpen = () => {
    setFeatureForm(true);
  };

  const featureFormClose = () => {
    setFeatureForm(false);
  };
  // (data => {
  //   console.log("WE ARE HERE");
  //   if (!data[0]) {
  //     console.log("NOT FOUND YOO");
  //     return (<div>NOT FOUND PRODUCT</div>);
  //   }
  // });

  // count = product_records.find({"name": id}).count();
  // if(count == 0){
  //   console.log("NOT FOUND PRODUCT");
  //   return (<div>not found</div>);
  // }
  // console.log("FOUND PRODUCT");

  const handleFeatureNameChange = (event) => {
    setFeatureName(event.target.value);
  };

  const handleFeatureCategoryChange = (event) => {
    setFeatureCategory(event.target.value);
  };

  const addFeature = (event) => {
    event.preventDefault();
    if (featureName === '' || featureCategory === '') return;
    else {
      const addedFeature = {
        id: features.length + 1,
        text: featureName,
        votes: 0,
        upVoted: true,
        email: user,
        timestamp: Date.now(),
        tags: [featureCategory],
        comments: [],
      };
      const form = new FormData();
      form.append('features', JSON.stringify(addedFeature));
      Service.post('/' + id + '/features', form).then((data) => {});
      setFeatures(features.concat(addedFeature));
      setFeatureName('');
      setFeatureCategory('');
      featureFormClose();
    }
  };

  const [features, setFeatures] = useState([]);
  const [user, setUser] = useState('');
  const [editable, setEditable] = useState(false);
  const [productId, setProductId] = useState();
  const [timeline, setTimeline] = useState([]);
  const getTimeline = (product_name) => {
    Service.get('/' + product_name + '/getTimeline').then((data) => {
      if (data) {
        console.log(timeline);
      }
    });
  };
  useEffect(() => {
    //console.log(window.location.pathname);
    setUser(username);
    Service.get(window.location.pathname).then((data) => {
      setProductId(data[0] ? data[0].uid : '');
      setFeatures(data[0] ? data[0].features : []);
      console.log(features);
      if (data[0] && data[0].users && data[0].users.includes(user)) {
        setEditable(true);
      }
    });
  }, [user]);

  useEffect(() => {
    Service.get('/' + id + '/getTimeline').then((data) => {
      if (data) {
        //console.log(data[0]['timeline'])
        setTimeline(data[0]?data[0]['timeline']:[]);
      }
    });
  }, []);

  const [flag, setFlag] = useState(0);
  const [reload, setReload] = useState(0);
  const addUserView = () => {
    const form = new FormData();
    form.append('name', id);
    form.append('useremail', ReactSession.get('username'));
    // // console.log(ReactSession.get("username"))
    // // console.log(form.get("name"))
    Service.post('/addUserView', form).then((data) => {
      if (data) {
        // console.log(data)
        ////console.log(data)
      } else {
        ////console.log(data)
      }
      /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
    });
  };

  useEffect(() => {
    // // console.log("here")
    Service.get(window.location.pathname).then((data) => {
      // //console.log(data.length);
      if (data.length == 0) {
        setFlag(1);
      }
    });

    addUserView();
  }, []);

  if (flag == 1) {
    return <div>PRODUCT NOT FOUND</div>;
  }
  return (
    <div className="container">
      <div className="child">
        <div className="product-title">
          <h3>{id.toUpperCase()}</h3>
          <div className="sort">
            <p
              className={sortBy === 'votes' ? 'highlight' : ''}
              data-testid="prod_sortpop"
              onClick={() => setSortBy('votes')}
            >
              POPULAR
            </p>
            <p> | </p>
            <p
              className={sortBy === 'timestamp' ? 'highlight' : ''}
              data-testid="prod_sorttime"
              onClick={() => setSortBy('timestamp')}
            >
              LATEST
            </p>
          </div>
        </div>
      </div>
      <div className="child inputContainer">
        <Button
          size="small"
          onClick={loggedin ? featureFormOpen : loginCheckOpen}
          variant="outlined"
          style={{
            backgroundColor: '#218888',
            color: '#fff',
            marginRight: '10px',
          }}
        >
          Add New Feature
        </Button>

        <Dialog open={featureForm} onClose={featureFormClose}>
          <DialogTitle>Add a feature</DialogTitle>
          <DialogContent data-testid="prod_input">
            <DialogContentText>
              Please enter name and category of feature:
            </DialogContentText>
            <TextField
              label="Text Field"
              value={featureName}
              onChange={handleFeatureNameChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <RadioGroup
              aria-label="Feature Options"
              name="featureOptions"
              value={featureCategory}
              onChange={handleFeatureCategoryChange}
            >
              <FormControlLabel
                value="New Feature"
                control={<Radio />}
                label="New Feature"
              />
              <FormControlLabel
                value="Enhancement"
                control={<Radio />}
                label="Enhancement"
              />
              <FormControlLabel
                value="Performance Improvement"
                control={<Radio />}
                label="Performance Improvement"
              />
              <FormControlLabel
                value="Security Enhancement"
                control={<Radio />}
                label="Security Enhancement"
              />
              <FormControlLabel
                value="Usability and UX Improvements"
                control={<Radio />}
                label="Usability and UX Improvements"
              />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={addFeature}>Ok</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={loginCheck}
          onClose={loginCheckClose}
          PaperProps={{style: {minWidth: '400px'}}}
        >
          <DialogTitle>Action Required</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please login to add a feature!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={loginCheckClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="main-content">
        <div className="features">
          {features
            .map((f, index) => {
              f['index'] = index;
              return f;
            })
            .filter((f) =>
              query
                ? f.tags.includes(query.toLowerCase()) ||
                  f.text.toLowerCase().includes(query.toLowerCase())
                : true
            )
            .map(
              (feature) => (
                <Feature
                  key={feature.id}
                  features={features}
                  index={feature.index}
                  setFeatures={setFeatures}
                  editable={editable}
                  setTimeline={setTimeline}
                  productId={productId}
                />
              ),
              setFeatures
            )}
        </div>
        <div className="timeline">
          <h3 className="timeline-title">TIMELINE</h3>
          <Timeline position="alternate-reverse">
            {timeline.map((t, index) => {
              return (
                // {feature_name = t.text}
                <ProductTimeline
                  feature_name={t.text}
                  index={index}
                ></ProductTimeline>
                // <div>{t.text}</div>
              );
            })}
          </Timeline>
        </div>
      </div>

      <Comments />
    </div>
  );
};

export default Product;
