import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Icon,
  Upload,
  Card,
  Form,
  Switch,
  Button,
  Input,
  Select,
  Modal,
  message,
  Radio,
  notification,
  InputNumber
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import Inputval from '../../components/QueryConditionItem/Inputval';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const FormItem = Form.Item;

const RadioGroup = Radio.Group;

@connect(state => ({
  fractionalRule: state.fractionalRule,
}))
@Form.create()
export default class VipManage extends Component {
  state = {};

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'fractionalRule/getScoreConfigItem',
    })

  }

  handleChange = (e) => {
    e.preventDefault()
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {
        ...fieldsValue,
      };
      if ((values.questionTopicHardPercent + values.questionTopicNormalPercent + values.questionTopicEasyPercent) != 100) {
        notification.error({
          message: '知识点答题难易度占比总和应为100%',
        });
        return;
      }
      if ((values.randomAnswerNormalPercent + values.randomAnswerHardPercent + values.randomAnswerEasyPercent) != 100) {
        notification.error({
          message: '随机答题难易度占比总和应为100%',
        });
        return;
      }
      if ((values.customAnswerHardPercent + values.customAnswerNormalPercent + values.customAnswerEasyPercent) != 100) {
        notification.error({
          message: '自定义组题难易度占比总和应为100%',
        });
        return;
      }
      dispatch({
        type: 'fractionalRule/addScoreConfigData',
        payload: {
          values: {...values},

        }
      });

    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
  }

  render() {
    const {fractionalRule: {loading: ruleLoading, scoreConfig}, form: {getFieldDecorator}} = this.props;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };
    console.log(scoreConfig && scoreConfig.questionTopicScore)
    return (
      <PageHeaderLayout title="分数规则">
        <Form onSubmit={this.handleChange}>
          <div className={styles.content}>
            <FormItem label="参观展厅最低分设置">
              {getFieldDecorator('minScore', {
                initialValue: scoreConfig && scoreConfig.minScore != undefined ? scoreConfig.minScore : '',
              })(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'单行输入'} autoComplete="off"/>,
              )}
            </FormItem>
          </div>
          <div className={styles.content}>
            <FormItem label="展板学习分数设置">
              {getFieldDecorator('displayBoardScore', {
                initialValue: scoreConfig && scoreConfig.displayBoardScore != undefined ? scoreConfig.displayBoardScore : '',
              })(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'单行输入'} autoComplete="off"/>,
              )}
            </FormItem>
            <div className={styles.tilcenter}></div>
          </div>
          <div className={styles.content}>
            <FormItem label="知识点答题 分数设置">
              {getFieldDecorator('questionTopicScore', {
                initialValue: scoreConfig && scoreConfig.questionTopicScore != undefined ? scoreConfig.questionTopicScore : '',
              })(
                <InputNumber min={1} style={{width: '100%'}}  placeholder={'总分'} autoComplete="off"/>,
              )}
            </FormItem>
            {/*<div className={styles.tilflex}>难易度占比</div>*/}
            <FormItem label="困难">
              {getFieldDecorator('questionTopicHardPercent', {
                  initialValue: scoreConfig && scoreConfig.questionTopicHardPercent != undefined ? scoreConfig.questionTopicHardPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('questionTopicNormalPercent', {
                  initialValue: scoreConfig && scoreConfig.questionTopicNormalPercent != undefined ? scoreConfig.questionTopicNormalPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
            <FormItem label="简单">
              {getFieldDecorator('questionTopicEasyPercent', {
                  initialValue: scoreConfig && scoreConfig.questionTopicEasyPercent != undefined ? scoreConfig.questionTopicEasyPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
          </div>
          <div className={styles.content}>
            <FormItem label="随机答题 分数设置">
              {getFieldDecorator('randomAnswerScore', {
                initialValue: scoreConfig && scoreConfig.randomAnswerScore != undefined ? scoreConfig.randomAnswerScore : '',
              })(
                <InputNumber min={1} style={{width: '100%'}} autoComplete="off"/>,
              )}
            </FormItem>
            {/*<div className={styles.tilflex}>难易度占比</div>*/}
            <FormItem label="困难">
              {getFieldDecorator('randomAnswerHardPercent', {
                  initialValue: scoreConfig && scoreConfig.randomAnswerHardPercent != undefined ? scoreConfig.randomAnswerHardPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('randomAnswerNormalPercent', {
                  initialValue: scoreConfig && scoreConfig.randomAnswerNormalPercent != undefined ? scoreConfig.randomAnswerNormalPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
            <FormItem label="简单">
              {getFieldDecorator('randomAnswerEasyPercent', {
                  initialValue: scoreConfig && scoreConfig.randomAnswerEasyPercent != undefined ? scoreConfig.randomAnswerEasyPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
          </div>
          <div className={styles.content}>
            <FormItem label="自定义组题 分数设置">
              {getFieldDecorator('customAnswerScore', {
                initialValue: scoreConfig && scoreConfig.customAnswerScore != undefined ? scoreConfig.customAnswerScore : '',
              })(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'总分'} autoComplete="off"/>,
              )}
            </FormItem>
            {/*<div className={styles.tilflex}>难易度占比</div>*/}
            <FormItem label="困难">
              {getFieldDecorator('customAnswerHardPercent', {
                  initialValue: scoreConfig && scoreConfig.customAnswerHardPercent != undefined ? scoreConfig.customAnswerHardPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('customAnswerNormalPercent', {
                  initialValue: scoreConfig && scoreConfig.customAnswerNormalPercent != undefined ? scoreConfig.customAnswerNormalPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
            <FormItem label="简单">
              {getFieldDecorator('customAnswerEasyPercent', {
                  initialValue: scoreConfig && scoreConfig.customAnswerEasyPercent != undefined ? scoreConfig.customAnswerEasyPercent : '',
                },
              )(
                <InputNumber min={0} max={100} style={{width: '100%'}} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} placeholder={'占比'}/>,
              )}
            </FormItem>
          </div>
          <div className={styles.tilflex}>任务 分数设置：</div>
          <div className={styles.contents}>
            {/*<FormItem label="任务 分数设置">*/}

            {/*</FormItem>*/}

            <FormItem label="简单">
              {getFieldDecorator('missionEasyScore', {
                  initialValue: scoreConfig && scoreConfig.missionEasyScore != undefined ? scoreConfig.missionEasyScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('missionNormalScore', {
                  initialValue: scoreConfig && scoreConfig.missionNormalScore != undefined ? scoreConfig.missionNormalScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="困难">
              {getFieldDecorator('missionHardScore', {
                  initialValue: scoreConfig && scoreConfig.missionHardScore != undefined ? scoreConfig.missionHardScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
          </div>
          <div className={styles.tilflex}>限时抢答 分数设置：</div>
          <div className={styles.contents}>
            {/*<FormItem label="限时抢答 分数设置">*/}

            {/*</FormItem>*/}
            {/*<div className={styles.tilflex}>答对：</div>*/}
            <FormItem label="简单">
              {getFieldDecorator('limitTimeRaceAnswerEasyScore', {
                  initialValue: scoreConfig && scoreConfig.limitTimeRaceAnswerEasyScore != undefined ? scoreConfig.limitTimeRaceAnswerEasyScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('limitTimeRaceAnswerNormalScore', {
                  initialValue: scoreConfig && scoreConfig.limitTimeRaceAnswerNormalScore != undefined ? scoreConfig.limitTimeRaceAnswerNormalScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="困难">
              {getFieldDecorator('limitTimeRaceAnswerHardScore', {
                  initialValue: scoreConfig && scoreConfig.limitTimeRaceAnswerHardScore != undefined ? scoreConfig.limitTimeRaceAnswerHardScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
          </div>
          <div className={styles.tilflex}>谁来作答抢答 分数设置：</div>

          <div className={styles.contents}>
            {/*<FormItem label="谁来作答抢答 分数设置">*/}

            {/*</FormItem>*/}
            {/*<div className={styles.tilflex}>答对：</div>*/}
            <FormItem label="简单">
              {getFieldDecorator('whoRaceAnswerEasyScore', {
                  initialValue: scoreConfig && scoreConfig.whoRaceAnswerEasyScore != undefined ? scoreConfig.whoRaceAnswerEasyScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('whoRaceAnswerNormalScore', {
                  initialValue: scoreConfig && scoreConfig.whoRaceAnswerNormalScore != undefined ? scoreConfig.whoRaceAnswerNormalScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="困难">
              {getFieldDecorator('whoRaceAnswerHardScore', {
                  initialValue: scoreConfig && scoreConfig.whoRaceAnswerHardScore != undefined ? scoreConfig.whoRaceAnswerHardScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
          </div>
          <div className={styles.tilflex}>谁与争锋 分数设置：</div>
          <div className={styles.contents}>
            {/*<FormItem label="谁与争锋 分数设置">*/}

            {/*</FormItem>*/}
            <FormItem label="小组第一">
              {getFieldDecorator('challengeFirstScore', {
                  initialValue: scoreConfig && scoreConfig.challengeFirstScore != undefined ? scoreConfig.challengeFirstScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="小组第二">
              {getFieldDecorator('challengeSecondScore', {
                  initialValue: scoreConfig && scoreConfig.challengeSecondScore != undefined ? scoreConfig.challengeSecondScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="小组第三">
              {getFieldDecorator('challengeThirdScore', {
                  initialValue: scoreConfig && scoreConfig.challengeThirdScore != undefined ? scoreConfig.challengeThirdScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
            <FormItem label="小组第四">
              {getFieldDecorator('challengeFourthScore', {
                  initialValue: scoreConfig && scoreConfig.challengeFourthScore != undefined ? scoreConfig.challengeFourthScore : '',
                },
              )(
                <InputNumber min={1} style={{width: '100%'}} placeholder={'分数'}/>,
              )}
            </FormItem>
          </div>
          <span style={{width: '100%', display: 'block', textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" style={{marginRight: '20px', padding: '0 50px'}}>保存</Button>
                <Button htmlType="submit" onClick={this.handleCancel} style={{padding: '0 50px'}}>取消</Button>
              </span>
        </Form>

      </PageHeaderLayout>
    );
  }
}
