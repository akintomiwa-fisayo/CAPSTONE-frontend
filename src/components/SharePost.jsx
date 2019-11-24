import React from 'react';
import '../css/sharepost.css';
import lib from '../js/lib';
import sample from '../images/lion.jpg';

const gifPost = {
  type: 'gif',
  title: '',
  image: null,
};

const articlePost = {
  type: 'article',
  title: '',
  article: '',
};
const $ = (query) => document.querySelector(query);

class SharePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      post: gifPost,
    };

    this.onDisplayChange = this.onDisplayChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.onGifDrop = this.onGifDrop.bind(this);
  }

  onDisplayChange(event) {
    const el = event.target;
    const postGifBlock = $('#postGifBlock');
    const gif = el.files[0];
    if (gif && gif.type === 'image/gif') {
      if (gif.size > 10485760) { // 10mb
        lib.popMessage("can't upload image larger than 10mb");
      } else {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(gif);

        fileReader.onerror = () => {
          lib.popMessage('Oops!, we couldn\'t attach the file picked please try again or try another one');
        };

        fileReader.onload = (frEvent) => {
          const fileSrc = frEvent.target.result;
          $('#postGif').src = fileSrc;
          postGifBlock.classList.remove('Error');
          this.setState((prevState) => ({
            post: {
              ...prevState.post,
              image: gif,
            },
          }));
        };
      }
    } else {
      lib.popMessage('Image as to be a GIF (.gif) file');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onGifDragLeave() {
    $('#postGifBlock').classList.remove('drag-over');
  }

  // eslint-disable-next-line class-methods-use-this
  onGifDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    $('#postGifBlock').classList.add('drag-over');
  }

  // eslint-disable-next-line class-methods-use-this
  onGifDrop(event) {
    event.preventDefault();
    const handleDrop = (pickedFile) => {
      // Emulator event structure (accept only file)
      if (pickedFile.kind === 'file') {
        const file = {
          target: {
            files: [pickedFile.getAsFile()],
          },
        };
        this.onDisplayChange(file);
      }
    };

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      handleDrop(event.dataTransfer.items[0]);
    } else {
      // Use DataTransfer interface to access the file(s)
      handleDrop(event.dataTransfer.files[0]);
    }
  }

  onTitleChange(event) {
    const title = event.target.value;
    this.setState((prevState) => ({ post: { ...prevState.post, title } }));

    if (!lib.isEmpty(title)) event.target.classList.remove('Error');
  }

  resetForm() {
    const post = this.state.post.type === 'gif' ? gifPost : articlePost;
    this.setState(() => ({ post }));

    if (post.type === 'gif') {
      $('#postGif').src = '';
      $('#gifPicker').value = null;
    }
  }

  submitPost() {
    if (this.state.submitting === false) {
      const { post } = this.state;
      const validate = () => {
        let err = false;

        if (lib.isEmpty(post.title)) {
          $('#postGifContainer .form-element[name=title]').classList.add('Error');
          err = true;
        } else $('#postGifContainer .form-element[name=title]').classList.remove('Error');

        if (post.type === 'gif') {
          if (post.image === null) {
            $('#postGifBlock').classList.add('Error');
            err = true;
          } else $('#postGifBlock').classList.remove('Error');
        } else if (lib.isEmpty(post.article)) {
          $('#postGifContainer .form-element[name=article]').classList.add('Error');
          err = true;
        } else $('#postGifContainer .form-element[name=article]').classList.remove('Error');

        return !err;
      };

      if (validate()) {
        this.setState(() => ({ submitting: true }));

        const form = new FormData();
        form.append('title', post.title);
        if (post.type === 'gif') {
          form.append('image', post.image);
        } else {
          // If post type is article
          form.append('article', post.article);
        }

        fetch('https://akintomiwa-capstone-backend.herokuapp.com/gifs', {
          method: 'POST',
          body: form,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sessionUserToken')}`,
          },
        }).then((res) => {
          if (res.status === 201 || res.status === 400) return res.json();
          throw new Error();
        }).then((res) => {
          if (res.status === 'error') {
            $('#postGifBlock').classList.add('Error');
            lib.popMessage('invalid image uploaded please retry with a .gif file');
          } else {
            this.resetForm();
            lib.popMessage('post created successfully');
          }
        }).catch((error) => {
          console.log(error);
          lib.popMessage('Oops!, there was a server error, please try again');
        })
          .finally(() => {
            this.setState(() => ({ submitting: false }));
          });
      } else {
        lib.popMessage('Please complete the form before submitting');
      }
    }
  }

  render() {
    let content = null;
    const { post } = this.state;
    if (post.type === 'gif') {
      content = (
        <div id="postGifContainer">
          <input type="text" className="form-element title" name="title" value={post.title} placeholder="gif title" onChange={this.onTitleChange} />
          <div id="postGifBlock" className={post.image !== null ? 'selected' : ''} onClick={() => { $('#gifPicker').click(); }}>
            <img id="postGif" alt="post gif" src={sample} />
            <div className="bk">
              <span className="fa fa-image icon" />
              <p>click to pick a gif image or drag and drop it here</p>
            </div>
            <div className="overlay">
              <p>Drop it like it&apos;s hot!</p>
              <div
                className="drop-container"
                onDrop={this.onGifDrop}
                onDragOver={this.onGifDragOver}
                onDragLeave={this.onGifDragLeave}
              />
            </div>
            <input type="file" className="form-element" name="postGif" id="gifPicker" accept="image/gif" onChange={this.onDisplayChange} />
          </div>
        </div>
      );
    } else {
      // If its article
    }

    return (
      <div id="sharePost">
        <div className="head">
          <h2 className="label">share a post</h2>
          <span className={`icon ${post.type === 'gif' ? 'fa fa-image' : 'fa newspaper'}`} />
        </div>
        <div className="content">
          {content}
        </div>
        <div className="bottom">
          <div className="post-types">
            <button type="button" className={`post-type ${post.type === 'article' ? 'active' : ''}`}>article</button>
            <button type="button" className={`post-type ${post.type === 'gif' ? 'active' : ''}`}>gif</button>
          </div>
          <button type="submit" className={this.state.submitting ? 'disabled' : ''} onClick={this.submitPost}>
            <span>
              <span className="fk">
                <span>post </span>
                <span className={`fas ${this.state.submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} icon`} />
              </span>
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default SharePost;
