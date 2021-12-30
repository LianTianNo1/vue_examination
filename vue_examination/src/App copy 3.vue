<template>
  <div id="app">
    <div class="uploadfile" v-if="chooseFileShow">
      <div @click="targetChooseFile" class="uploadfile_btn">上传文件</div>
      <input
        type="file"
        @change="chooseFile($event)"
        ref="file"
        class="choose_file"
      />
    </div>
    <div class="headinfo">
      <div class="head_title">小浪简陋做题</div>
    </div>
    <div v-show="errPageShow" class="err_container">
      <div class="head_nav">一共错误{{ errNumber }}题</div>
      <div class="error_list"></div>
    </div>
    <div v-show="containerShow" class="container">
      <div class="left">
        <div
          v-show="JSON.stringify(sign_list_data) !== '{}'"
          class="sign_choose"
        >
          <div class="left_title">单选题</div>
          <div class="left_item">
            <div
              @click="item_index = index"
              :key="item[sign_list_data['title_index']]"
              v-for="(item, index) in sign_list_data.data"
              :class="{
                serial: true,
                serial_visited: answerList[index],
              }"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
        <div
          v-show="JSON.stringify(mult_list_data) !== '{}'"
          class="sign_choose"
        >
          <div class="left_title">多选题</div>
          <div class="left_item">
            <div
              @click="item_index = index"
              :key="item[mult_list_data['title_index']]"
              v-for="(item, index) in mult_list_data.data"
              :class="{
                serial: true,
                serial_visited: answerList[index],
              }"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
        <div @click="showResult" class="submit">提交</div>
      </div>
      <div class="right">
        <div class="exercises_box">
          <div
            v-show="index === item_index"
            :key="item[sign_list_data['title_index']]"
            v-for="(item, index) in sign_list_data.data"
            class="exercises_item"
          >
            <div class="etile">
              {{ index + 1 }}: {{ item[sign_list_data['title_index']] }}
            </div>
            <div class="echoose">
              <div @click="savaAnswer(index, 'A', $event)" class="choose_item">
                {{ item[sign_list_data['A_index']] }}
              </div>
              <div @click="savaAnswer(index, 'B', $event)" class="choose_item">
                {{ item[sign_list_data['B_index']] }}
              </div>
              <div @click="savaAnswer(index, 'C', $event)" class="choose_item">
                {{ item[sign_list_data['C_index']] }}
              </div>
              <div @click="savaAnswer(index, 'D', $event)" class="choose_item">
                {{ item[sign_list_data['D_index']] }}
              </div>
            </div>
            <div class="hide_item">
              正确答案:
              {{ item[sign_list_data['result_index']] }}
            </div>
          </div>
        </div>
        <div @click="nextItem" class="next_item">下一题</div>
        <div @click="preItem" class="next_item">上一题</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleFlag: true,
      // 单选题库索引，题目，正确答案等等
      sign_list_data: {},
      // 多选
      mult_list_data: {},
      // 当前显示的项的索引
      item_index: 0,
      // 选择文件的按钮是否出现
      chooseFileShow: true,
      // 下一题
      nextShow: false,
      // 提交按钮
      submitShow: false,
      // 储存用户的答案
      answerList: [],
      // 错题页面显示
      errPageShow: false,

      // 答题内容显示
      containerShow: true,
      // 错题量
      errNumber: 0
    }
  },
  methods: {
    // 触发文件选择
    targetChooseFile() {
      const chooseFile = this.$refs.file
      chooseFile.click()
    },
    // 选择文件
    chooseFile(e) {
      const file = e.target.files[0]
      // console.log(file)
      const formData = new FormData();
      formData.append("file", file);
      this.uploadFile(formData)
    },
    // 上传文件
    uploadFile(formData) {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // this.$axios.post('http://120.25.249.159:3000/demo/examination/readFile', formData, config).then(res => {
      this.$axios.post('http://127.0.0.1:3000/demo/examination/readFile', formData, config).then(res => {
        // this.$axios.post('/demo/examination/readFile', formData, config).then(res => {
        if (res.data.code === 1 && res.data.error === null) {
          console.log(res)
          this.sign_list_data = res.data.data.sign_data
          this.sign_list_data.data.shift()
          this.mult_list_data = res.data.data.mult_data
          this.mult_list_data.data.shift()
          this.chooseFileShow = false
          this.mytip.createTip(res.data.msg, '#00BCD4', '#E0F7FA')
          // console.log(this.sign_list_data)
        } else {
          console.log(res)
          this.mytip.createTip(res.data.msg, '#FFAB91', '#F48FB1')
        }
      })
    },
    // 下一题
    preItem() {
      if (this.item_index <= 0) {
        return false
      }
      this.item_index--
    },
    // 下一题
    nextItem() {
      if (this.item_index >= this.sign_list_data.data.length) {
        return false
      }
      this.item_index++
    },
    // 保存答案
    savaAnswer(index, choose, e) {
      this.answerList[index] = choose

      if (this.sign_list_data.data[this.item_index][this.sign_list_data.result_index] === this.answerList[this.item_index]) {
        e.target.parentNode.parentNode.isSuccess = true
        e.target.parentNode.parentNode.setAttribute('isSuccess', true)
      } else {
        e.target.parentNode.parentNode.isSuccess = false
        e.target.parentNode.parentNode.setAttribute('isSuccess', false)
      }
      console.log(this.answerList)
      const chooseItmes = [...e.target.parentNode.children]
      chooseItmes.forEach(item => {
        item.className = 'choose_item'
      })
      e.target.className = 'choose_item choose_item_active'
    },
    // 通过题号获取
    chooseItemIndex(index) {
      this.item_index = index
    },
    // 答题结果
    showResult() {
      this.containerShow = false
      this.errPageShow = true
      const errorList = []
      const successList = []
      const totalList = [...document.querySelectorAll('.exercises_item')]
      const errorDivDom = document.querySelector('.error_list')
      // console.log(errorDivDom)
      totalList.forEach(item => {
        item.style.display = 'block'
        item.children[2].style.display = 'block'
        if (item.isSuccess) {
          successList.push(item)
        } else {
          errorList.push(item)

          errorDivDom.appendChild(item)
        }
      })
      this.errNumber = errorList.length
      // console.log(successList, errorList)
    }
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
#app {
  margin: 0;
  height: 100vh;
  background-color: #96adc8;
}
.uploadfile {
  z-index: 99999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.473);
  display: flex;
  justify-content: center;
  align-items: center;
}
.uploadfile_btn {
  padding: 1rem 2rem;
  color: white;
  background-color: #ff5964;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 1s;
}
.uploadfile_btn:hover {
  background-color: #35a7ff;
}
#app {
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
  /* overflow: hidden; */
}
.choose_file {
  width: 0;
  height: 0;
}
.headinfo,
.head_nav {
  margin-bottom: 1rem;
  background-color: #f5f7fa;
  box-shadow: 0px 1px 7px #00000033;
}
.head_nav {
  color: white;
  background-color: #ff6600;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}
.head_title {
  color: #336699;
  width: 100%;
  font-weight: bold;
  font-size: 2rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  width: 100%;
  /* height: 100vh; */
  display: flex;
  overflow: hidden;
  justify-content: space-between;
}

.left {
  height: 100%;
  width: 20%;
  padding: 1rem;
  background-color: #f5f7fa;
  box-shadow: 1px 1px 7px #00000033;
  overflow-y: auto;
  padding-bottom: 6rem;
}
.left_title {
  height: 2rem;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 10px solid #50c1e9;
  box-shadow: 1px 1px 7px #00000033;
}
.left_item {
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.serial {
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  margin: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 1px 1px 3px #00000033;
}
.serial_visited {
  background-color: #1ec0ff;
  color: white;
}
.right {
  height: 100%;
  width: 78%;
  background: #f5f7fa;
  box-shadow: -1px -1px 7px #00000033;
  padding: 2rem;
}
.exercises_box {
  /* background-color: rgba(173, 115, 115, 0.438); */
}
.exercises_item {
  display: block;
}
.etile {
  color: #008c9e;
  display: flex;
  padding: 1rem 2rem;
  font-weight: bold;
  font-size: 2rem;
  border-left: 10px solid #50c1e9;
  box-shadow: 1px 1px 7px #a5939333;
  margin-bottom: 2rem;
}
.hide_item {
  display: none;
  color: white;
  padding: 1rem 1rem 1rem 5rem;
  box-shadow: 3px 3px 7px 2px #a5939333;
  cursor: pointer;
  position: relative;
  margin: 20px 0;
  background-color: #2cc0b3;
}
.choose_item {
  padding: 1rem 1rem 1rem 5rem;
  box-shadow: 3px 3px 7px 2px #a5939333;
  cursor: pointer;
  position: relative;
  margin: 20px 0;
}
.choose_item_active {
  background-color: #c3c3e5;
  color: white;
}
.choose_item::before {
  position: absolute;
  content: 'A';
  color: white;
  left: 0rem;
  background-color: #fcaa67;
  height: 100%;
  width: 3rem;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.echoose > div:nth-child(2)::before {
  content: 'B';
  background-color: #1ec0ff;
}
.echoose > div:nth-child(3)::before {
  content: 'C';
  background-color: #e94c6f;
}
.echoose > div:nth-child(4)::before {
  content: 'D';
  background-color: #1fda9a;
}
.next_item,
.submit {
  margin: 2rem 0;
  background-color: #f16b6f;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  cursor: pointer;
  box-shadow: 3px 3px 7px 2px #a5939333;
}
.submit {
  background-color: #35a7ff;
}
.err_container {
  /* overflow: hidden; */
  position: absolute;
  display: block;
  z-index: 99999;
  background: #f5f5f5;
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
}
.error_list {
  padding-top: 2rem;
  width: 100vw;
  /* height: 100vw; */
  /* overflow-y: scroll; */
  position: relative;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  background-color: #96adc8;
}
.error_list .exercises_item {
  width: 28%;
  margin-bottom: 2rem;
  box-shadow: 1px 1px 7px #00000033;
  border-radius: 15px;
  background-color: #f5f5f5;
  overflow: hidden;
}
.error_list .exercises_item .etile {
  font-size: 1rem;
}
</style>
