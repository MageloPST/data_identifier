import React, { useState } from 'react'
import axios from 'axios'
import { Progress } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_URL } from './config'

const App = () => {
  const [selectedFile, setSelectedFile] = useState([])
  const [loaded, setLoaded] = useState(0)

  const checkMimeType = ({
    target: { files }
  }: React.ChangeEvent<HTMLInputElement>) => {
    //define message container
    let err: string[] = []
    // list allow mime type
    const types = ['application/json']
    // loop access array
    if (files) {
      for (var x = 0; x < files.length; x++) {
        // compare file type find doesn't matach
        // eslint-disable-next-line no-loop-func
        if (types.every(type => files[x].type !== type)) {
          // create error message and assign to container
          err[x] = files[x].type + ' is not a supported format\n'
        }
      }
    }

    err.forEach(e => {
      // if message not same old that mean has error
      // discard selected file
      toast.error(e)
    })
    return true
  }

  const onChangeHandler = (event: any) => {
    var files = event.target.files
    if (checkMimeType(event)) {
      // if return true allow to setState
      setSelectedFile(files)
      setLoaded(0)
    }
  }
  const onClickHandler = () => {
    const data = new FormData()
    for (var x = 0; x < selectedFile.length; x++) {
      data.append('file', selectedFile[x])
    }

    axios
      .post(API_URL, data, {
        onUploadProgress: ProgressEvent => {
          setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100)
        }
      })
      .then(res => {
        // then print response status
        toast.success('upload success')
      })
      .catch(err => {
        // then print response status
        toast.error('upload fail', err)
      })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="offset-md-3 col-md-6">
          <div className="form-group files">
            <label>Upload Json File </label>
            <input
              type="file"
              accept=".json,application/json"
              className="form-control"
              multiple
              onChange={onChangeHandler}
            />
          </div>
          <div className="form-group">
            <ToastContainer />
            <Progress max="100" color="success" value={loaded}>
              {Math.round(loaded)}%
            </Progress>
          </div>

          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={onClickHandler}
          >
            Send File
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
