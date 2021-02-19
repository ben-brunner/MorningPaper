import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import '../App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([]);
  const [language, setLanguage] = useState(props.language);

  // useEffect(() => {
    
  //     const findLang = async () => {
  //     const raw = await fetch(`/user-lang?token=${props.token}`);
  //     const data = await raw.json();
  //     setLanguage(data.lang)
  //     };
  //     findLang();

  // }, []);
  
  useEffect(() => {
    const getSources = async () => {
      let country = 'fr';
      let lang = 'fr';
      if (language === 'en') {
        country = 'gb';
        lang = 'en';
      } else if (language === 'us') {
        country = 'us';
        lang = 'en';
      };
      props.changeLang(language);

      const raw = await fetch(`/sources/${country}/${lang}`, {
      });
      const data = await raw.json();
      setSourceList(data.data.sources)
      };
    getSources();
  }, [language]);

  const updateLang = async (lang) => {
    setLanguage(lang);
    const reqLang = await fetch('/user-lang', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&lang=${lang}`
    })
  };


  const styleBorderFr = {height: '60%', marginLeft:'10px', cursor:'pointer'};

  if(language == 'fr'){
    styleBorderFr.border = '2px solid white'
  };

  const styleBorderEn = {height: '60%', marginLeft:'10px',cursor:'pointer'};

  if(language == 'en'){
    styleBorderEn.border = '2px solid white'
  };

  const styleBorderUs = {height: '60%', marginLeft:'10px',cursor:'pointer'};

  if(language == 'us'){
    styleBorderUs.border = '2px solid white'
  };

  return (
    <div>
      <Nav/>
       
      <div className="Banner">
        <img style={styleBorderFr} alt="flag FR" src="./images/fr.png" onClick={() => updateLang('fr')} />
        <img style={styleBorderEn} alt="flag UK" src="./images/uk.png" onClick={() => updateLang('en')} />
        <img style={styleBorderUs} alt="flag US" src="./images/us.png" onClick={() => updateLang('us')} />
      </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`./images/${item.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${item.id}`}>{item.name}</Link>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state) {
  return {language: state.language, token: state.token};
};

function mapDispatchToProps(dispatch) {
  return {
    changeLang(language) {
      dispatch({ type: 'changeLang', language: language })
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource);
