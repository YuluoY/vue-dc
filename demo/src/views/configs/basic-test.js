/**
 * 基础测试配置 - 简单表单示例
 */
import { ElNotification } from "element-plus"
import { ref } from "vue"

// 简单登录表单
export const simpleLoginForm = {
  title: "简单登录表单",
  type: "el-form",
  namespace: 'loginData',
  props: {
    labelWidth: "80px",
    style: "max-width: 400px; margin: 20px auto;"
  },
  children: [
    {
      type: "el-form-item",
      props: {
        label: "用户名"
      },
      children: {
        type: "el-input",
        props: {
          modelValue: { path: "username", value: "" },
          placeholder: "请输入用户名",
          clearable: true
        }
      }
    },
    {
      type: "el-form-item",
      props: {
        label: "密码"
      },
      children: {
        type: "el-input",
        props: {
          modelValue: { path: "password", value: "" },
          placeholder: "请输入密码",
          type: "password",
          "show-password": true,
          clearable: true
        }
      }
    },
    {
      type: "el-form-item",
      children: [
        {
          type: "el-button",
          props: {
            type: "primary",
            style: "width: 100%;"
          },
          events: {
            'keyup.enter': {
              handler: function(evt) {  
                ElNotification({
                  title: "登录成功"
                })
              }
            },
            click: {
              handler: function() {
                const formData = this.getRawModel('loginData')
                ElNotification({
                  title: "登录成功",
                  message: 
                  `
                  <p>用户名：${formData?.username}</p>
                  <p>密码：${formData?.password}</p>
                  `,
                  type: "success",
                  dangerouslyUseHTMLString: true
                })
              },
              debounce: 200
            }
          },
          children: "登录"
        }
      ]
    }
  ]
}

export const simpleLoginForm2 = {
  title: "简单登录表单",
  type: "el-form",
  props: {
    modelValue: { path:'loginData2', value: { username: "66213123", password: "" } },
    labelWidth: "80px",
    style: "max-width: 400px; margin: 20px auto;"
  },
  children: [
    {
      type: "el-form-item",
      props: {
        label: "用户名"
      },
      children: {
        type: "el-input",
        props: {
          modelValue: { path: "loginData2.username" },
          placeholder: "请输入用户名",
          clearable: true
        }
      }
    },
    {
      type: "el-form-item",
      props: {
        label: "密码"
      },
      children: {
        type: "el-input",
        props: {
          modelValue: { path: "loginData2.password", value: "" },
          placeholder: "请输入密码",
          type: "password",
          "show-password": true,
          clearable: true
        }
      }
    },
    {
      type: "el-form-item",
      children: [
        {
          type: "el-button",
          props: {
            type: "primary",
            style: "width: 100%;"
          },
          events: {
            click: function() {
              const formData = this.getRawModel('loginData2')
              ElNotification({
                title: "登录成功",
                message: 
                `
                <p>用户名：${formData.username}</p>
                <p>密码：${formData.password}</p>
                `,
                type: "success",
                dangerouslyUseHTMLString: true
              })
            }
          },
          children: "登录"
        }
      ]
    }
  ]
}

// 记事本表格
export const notebookTable =  {
  type: "el-table",
  props: {
    data: [
      {
        id: 1,
        title: "学习Vue3",
        content: "今天学习了Vue3的Composition API，感觉比Options API更灵活",
        createTime: "2024-01-15 10:30:00",
        status: "active"
      },
      {
        id: 2,
        title: "项目计划",
        content: "下周要完成用户管理模块的开发",
        createTime: "2024-01-14 15:20:00",
        status: "active"
      },
      {
        id: 3,
        title: "会议记录",
        content: "讨论了新功能的实现方案，确定了技术栈",
        createTime: "2024-01-13 09:15:00",
        status: "completed"
      }
    ],
    border: true,
    stripe: true,
    style: { width: "100%", minHeight: "300px" }
  },
  events: {
    'row-click': function(){
      const titleCol = { ...this.children[0] }
      titleCol.props.label = '标题2'
      this.children[0] = titleCol
      this.children = [...this.children]
    }
  },
  children: [
    {
      type: "el-table-column",
      props: {
        label: "标题",
        prop: "title"
      }
    },
    {
      type: "el-table-column",
      props: {
        label: "内容",
        prop: "content"
      }
    },
    {
      type: "el-table-column",
      props: {
        label: "创建时间",
        prop: "createTime"
      }
    }
  ].map(v => ({ ...v, wrapper: false }))
}