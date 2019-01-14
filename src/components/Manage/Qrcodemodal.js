import svgpath from 'svgpath';
// import qr from 'qr-image';
import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider, Input,Modal} from 'antd';
import styles from './index.less';
import QRCode from 'qrcode.react';
import url from "../../../utils/ipconfig";

class Qrcodemodal extends Component {
  render(){
    // const originPath = qr.svgObject(this.props.qrcodeText).path; //  获得二维码的绘制路径
    // const scaledPath = svgpath(originPath).scale(5, 5).toString();
    return(
      <div>
        <QRCode value={this.props.qrcodeText?`${url.qrcodeMangeUrl}`+this.props.qrcodeText:null}  level="H" style={{"width":"256px","height":"256px"}}/>
      </div>
    )
  }
}
export default Qrcodemodal;

{/*<svg width="100%" height="300" ref={(ref)=>this._qrcodeSVG = ref} transform="scale(2)">*/}
  {/*<path d={scaledPath?scaledPath:null}/>*/}
{/*</svg>*/}

