import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux'
import '../App.css';
import { Card, Icon, Modal, message } from 'antd';
import Nav from './Nav'

const { Meta } = Card;

function ScreenArticlesBySource(props) {

  const [articleList, setArticleList] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {

    const getArticles = async () => {

      const raw = await fetch(`/get-articles?id=${id}`);
      const data = await raw.json();
      setArticleList(data.articles);
    }
    getArticles();
  }, []);

  const showModal = (title, content) => {
    setIsModalVisible(true);
    setTitle(title);
    setContent(content);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const success = () => {
    message.success('Article added to "My Articles"', 1);
  };

  const clickAdd = async (img, title, desc, content) => {
    await fetch('/my-articles', { 
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&title=${title}&img=${img}&desc=${desc}&content=${content}&lang=${props.language}`,
    });

    props.addToMyArticles(img, title, desc, content);
    success();
  };
  
  const articles = articleList.map((article, i) => {
    return (
      <div key={i} style={{display:'flex',justifyContent:'center'}}>

        <Card
          style={{ 
          width: 300, 
          margin:'15px', 
          display:'flex',
          flexDirection: 'column',
          justifyContent:'space-between' }}
          cover={
          <img
              alt="article img"
              src= {article.urlToImage}
          />
          }
          actions={[
              <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.description)}/>,
              <Icon type="like" key="ellipsis" onClick={()=>clickAdd(article.urlToImage, article.title, article.description, article.content)} />
          ]}
          >

          <Meta
            title={article.title}
            description={article.description}
          />

        </Card>
        <Modal title={title} closable={false} maskStyle={{opacity: '0.2'}} visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel} >
          <p>{content}</p>
        </Modal>
      </div>
    )
  });

  return (
    <div>
         
      <Nav/>

      <div className="Banner"/>

      <div className="Card">
        {articles}
      </div> 

    </div>
  );
}

function mapStateToProps(state) {
  return { token: state.token, language: state.language }
};

function mapDispatchToProps(dispatch) {
  return {
    addToMyArticles: function (img, title, desc, content) {
      dispatch({ type: 'addArticle', articleLiked: {title: title, desc: desc, content: content, img: img}})
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenArticlesBySource);