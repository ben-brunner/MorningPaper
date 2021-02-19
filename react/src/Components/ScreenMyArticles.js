import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import '../App.css';
import { Card, Empty, Icon, Button, Modal} from 'antd';
import Nav from './Nav';
import { Link } from 'react-router-dom';

const { Meta } = Card;

function ScreenMyArticles(props) {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [langFilter, setLangFilter] = useState('');

  useEffect(() => {
    const findArticles = async () => {
      const raw = await fetch(`/my-articles?token=${props.token}`);
      const data = await raw.json();

      props.saveArticles(data.articles);
    }
    findArticles()
  }, []);
  
  const showModal = (title, desc) => {
      setIsModalVisible(true);
      setTitle(title);
      setContent(desc);
    };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const clickDelete = async (title) => {
    console.log(props.title);
    await fetch(`/my-articles/${props.token}/${title}`, {
      method: 'DELETE',
    });

    props.deleteToMyArticles(title);
  };
  
  const articleList = props.myArticles.map((article, i) => {
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
              alt="example"
              src={article.img}
          />
          }
          
          actions={[
            <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.description)} />,
            <Icon type="delete" key="ellipsis" onClick={() => clickDelete(article.title)} />
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

  const empty = () => {
    if (props.myArticles.length === 0) {
      return (
        <Empty
          style={{margin: '50px'}} image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 240,
          }}
          description={
            <span style={{fontSize: '20px'}}>
              No articles liked
            </span>
          }
        >
          <Link to="/screensource">
            <Button style={{color: '#fff', backgroundColor: '#8939c6'}}>Find articles</Button>
          </Link>
        </Empty>
      )
    }
  };

  return (
    <div>
         
      <Nav/>

      <div className="Banner"/>

      <div className="Card">
        {empty()}
        {articleList}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { myArticles: state.articles, token: state.token }
};

function mapDispatchToProps(dispatch) {
  return {
    deleteToMyArticles: function (title) {
      dispatch({ type: 'deleteArticle', articleLiked: {title: title} })
    },
    saveArticles: function (articles) {
      dispatch({ type: 'saveArticles', articles: articles })
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
