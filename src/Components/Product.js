import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactSession } from 'react-client-session';
import Feature from './Feature';
import Service from '../Service';
import Comments from './Comments';
//       Component: Product
//       Description: This component allows the user to add specific features and
//       allows the user to upvote or downvote the features
//
//       Inputs:
//           - NA
//       Outputs:
//          - NA
const Product = ({query}) => {
  const { id } = useParams();
 
 
 
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
  const [newFeature, setNewFeature] = useState('');
  const [sortBy, setSortBy] = useState('votes');

  const handleNewFeatureChange = (event) => {
    setNewFeature(event.target.value);
  };
  const addFeature = (event) => {
    event.preventDefault();
    if (newFeature === '')
      return;
    else {
      const addedFeature = {
        id: features.length + 1,
        text: newFeature,
        votes: 1,
        upVoted: true,
        timestamp: Date.now(),
        tags: ['enhancement'],
      };
      const form = new FormData();
      form.append("features", JSON.stringify(addedFeature));
      Service.post('/'+id+'/features', form)
        .then(data => {});
      setFeatures(features.concat(addedFeature));
      setNewFeature('');
    }
  };
  
  const [features, setFeatures] = useState([]);
  const [user, setUser] = useState('');
  const [editable, setEditable] = useState(false);

  const [timeline, setTimeline] = useState([]);
  const getTimeline = (product_name) => {
    Service.get('/'+product_name+'/getTimeline')
        .then(data => {
          if(data){
            console.log(timeline)
          }
        });
  }
  useEffect(() => {
    console.log(window.location.pathname);
    setUser(ReactSession.get("username"));
    Service.get(window.location.pathname).then(data => {
      setFeatures(data[0] ? data[0].features : []);
      if (data[0] && data[0].users && data[0].users.includes(user)) {
        setEditable(true);
      }

      
    });
  }, [user]);

  useEffect(()=>{
    Service.get('/'+id+'/getTimeline')
        .then(data => {
          if(data){
            console.log(data[0]['timeline'])
            setTimeline(data[0]['timeline'])
          }
        });
  },[])

  const [flag, setFlag] = useState(0);
  const addUserView = () => {
    const form = new FormData();
    form.append("name", id);
    form.append("useremail",ReactSession.get("username"))
    // console.log(ReactSession.get("username"))
    // console.log(form.get("name"))
    Service.post("/addUserView", form)
      .then((data) => 
        {
          if(data)
          { 
            
            // console.log(data)
          }else{
            console.log(data)
          }
          /*if (data.code > 200) {
            console.log("Error");
          } else {
            console.log(data.success);
          }*/
        });
  };

  useEffect(()=>{
    // console.log("here")
    Service.get(window.location.pathname).then(data=>{
      // console.log(data.length);
      if(data.length==0){


        //console.log("okay okay oky")
        setFlag(1)

      }
    })
   
    addUserView();

  },[])




  if(flag==1)

  {
    return (<div>PRODUCT NOT FOUND</div>);
  }
  return (
    <div className="container">
      <div className="child">
        <div className="product-title">
          <h3>{id.toUpperCase()}</h3>
          <div className="sort">
            <p className={sortBy === 'votes' ? 'highlight' : ''} data-testid="prod_sortpop" onClick={() => setSortBy('votes')}>POPULAR</p>
            <p> | </p>
            <p className={sortBy === 'timestamp' ? 'highlight' : ''} data-testid="prod_sorttime" onClick={() => setSortBy('timestamp')}>LATEST</p>
          </div>
        </div>
      </div>
      <div className="child inputContainer">
        <form data-testid="prod_form" onSubmit={addFeature}>
          <input 
          className="inputBar" 
          data-testid="prod_input"
          value={newFeature} 
          onChange={handleNewFeatureChange} 
          placeholder="Enter a feature that you'd love to see">
          </input>
        </form>
      </div>
      {features.map((f, index) => { f['index'] = index; return f; }).filter(f => query ? f.tags.includes(query.toLowerCase()) || f.text.toLowerCase().includes(query.toLowerCase()) : true).sort((f1, f2) => f2[sortBy] - f1[sortBy]).map(
        (feature) => <Feature key={feature.id} features={features} index={feature.index} setFeatures={setFeatures} editable={editable} setTimeline={setTimeline}/>
        , setFeatures)}
        <h3>{id.toUpperCase()} Timeline</h3>
        {timeline.map((t)=>{
          return (
            <div className="container">
              <div className="child">
                <div className="product-timeline">
                  
                  <div> {t.text} </div>
                </div>
              </div>
              </div>
          )
        })}
      <Comments />
    </div>
  );
};

export default Product;
