<template>
  <div id="app">
    <div
      ref="errorList"
      :class="{ error_list: true, error_list_show: errPageShow }"
    ></div>

    <div class="upload" v-if="chooseFileShow">
      <div class="showupload" @click="targetChooseFile">选择题库读取</div>
      <input
        type="file"
        @change="chooseFile($event)"
        ref="file"
        class="choose_file"
      />
    </div>
    <div v-if="containerShow" class="container">
      <ul
        v-if="list_data.lenght !== 0"
        :class="{ item_list: true, toggle_class: toggleFlag }"
      >
        <li
          @click="chooseItemIndex(index)"
          :key="index"
          :class="{ done: answerList[index] }"
          v-for="(item, index) in list_data.data"
        >
          {{ index + 1 }}
        </li>
        <div class="toggle" @click="toggleFlag = !toggleFlag">
          {{ toggleFlag ? '展开' : '收起' }}
        </div>
      </ul>
      <div class="box" v-if="list_data.lenght !== 0">
        <div
          :class="{ item: true, flag: index === item_index }"
          :key="index"
          v-for="(item, index) in list_data.data"
        >
          <div class="title">
            {{ index + 1 }}:{{ item[list_data.title_index] }}
          </div>
          <div class="chooseItem" @click="savaAnswer(index, 'A', $event)">
            <input type="radio" :name="item[list_data.title_index]" value="A" />
            <p class="choose_text">{{ item[list_data.A_index] }}</p>
          </div>
          <div class="chooseItem" @click="savaAnswer(index, 'B', $event)">
            <input type="radio" :name="item[list_data.title_index]" value="B" />
            <p class="choose_text">{{ item[list_data.B_index] }}</p>
          </div>
          <div class="chooseItem" @click="savaAnswer(index, 'C', $event)">
            <input type="radio" :name="item[list_data.title_index]" value="C" />
            <p class="choose_text">{{ item[list_data.C_index] }}</p>
          </div>
          <div class="chooseItem" @click="savaAnswer(index, 'D', $event)">
            <input type="radio" :name="item[list_data.title_index]" value="D" />
            <p class="choose_text">{{ item[list_data.D_index] }}</p>
          </div>
          <div class="actual_result">
            正确答案：{{ item[list_data.result_index] }}
          </div>
          <input
            type="hidden"
            :name="item[list_data.title_index]"
            :value="item[list_data.result_index]"
          />
        </div>
      </div>

      <button v-if="nextShow" @click="nextItem()" class="next">下一题</button>
      <button v-if="submitShow" @click="showResult()" class="submit">
        提交
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggleFlag: true,
      // 题库索引，题目，正确答案等等
      list_data: [],
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
      containerShow: true
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
      this.$axios.post('/demo/examination/readFile', formData, config).then(res => {
        if (res.data.code === 1 && res.data.error === null) {
          console.log(res)
          this.list_data = res.data.data
          this.list_data.data.shift()
          this.chooseFileShow = false
          this.nextShow = true
          this.mytip.createTip(res.data.msg, '#00BCD4', '#E0F7FA')
          // console.log(this.list_data)
        } else {
          console.log(res)
          this.mytip.createTip(res.data.msg, '#FFAB91', '#F48FB1')
        }
      })
    },
    // 下一题
    nextItem() {
      const flag = document.querySelector('div.flag')
      if (this.list_data.data[this.item_index][this.list_data.result_index] === this.answerList[this.item_index]) {
        flag.isSuccess = true
        flag.setAttribute('isSuccess', true)
      } else {
        flag.isSuccess = false
        flag.setAttribute('isSuccess', false)
      }
      this.item_index++
      if (this.item_index >= this.list_data.data.length) {
        this.nextShow = false
        this.submitShow = true
      }
    },
    // 保存答案
    savaAnswer(index, choose, e) {
      this.answerList[index] = choose
      const nowTargets = [...document.querySelectorAll('.flag>.chooseItem')]
      nowTargets.forEach(item => {
        item.children[0].checked = false
      })
      e.target.children[0].checked = true
      // console.log(nowTargets, this.answerList)
    },
    // 通过题号获取
    chooseItemIndex(index) {
      this.nextShow = true
      this.submitShow = false
      this.item_index = index
    },
    // 答题结果
    showResult() {
      this.submitShow = false
      this.containerShow = false
      this.errPageShow = true
      const errorList = []
      const successList = []
      const totalList = [...document.querySelectorAll('.item')]
      const errorDivDom = document.querySelector('.error_list')
      // console.log(errorDivDom)
      totalList.forEach(item => {
        item.className = 'item flag'
        item.children[5].style.display = 'block'
        if (item.isSuccess) {
          successList.push(item)
        } else {
          errorList.push(item)

          errorDivDom.appendChild(item)
        }
      })

      // console.log(successList, errorList)
    }
  },
}
</script>

<style scoped>
@media screen and (max-width: 450px) {
  .item {
    width: 100% !important;
    padding: 7% 2% !important;
  }
  .next {
    padding: 1rem 1rem !important;
    width: 70% !important;
  }
  .chooseItem {
    padding: 6vw 0 !important;
  }
}
body {
  margin: 0 !important;
  padding: 0 !important;
}
#app {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  text-align: center;
}
.error_list .item {
  width: 31%;
}
.upload {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.flag {
  display: block !important;
}
.item_list {
  width: 100%;
  position: fixed;
  top: 0%;
  padding: 4vw 2vw;
  box-shadow: 0 2px 10px 3px rgba(0, 0, 0, 0.3);
  background-color: #fafafa;
  display: flex;
  justify-content: flex-start;
  list-style: none;
  flex-wrap: wrap;
  transition: all 1s;
  perspective: 2000px;
  transform-style: preserve-3d;
  z-index: 99999;
}
.toggle {
  position: absolute;
  bottom: -40px;
  right: 10px;
  padding: 10px 10px;
  box-shadow: 2px 2px 4px 0px rgb(0 0 0 / 30%);
  background-color: #f0600d;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.toggle_class {
  transform: translate(0, -100%);
}
.item_list li {
  border-radius: 4px;
  box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.3),
    inset -1px 1px 0px 0px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  color: black;
  width: 42px;
  text-align: center;
  line-height: 42px;
  height: 42px;
  margin: 2px;
  transition: all 0.4s;
  transform-origin: left center;
}
.item_list li:hover {
  /* transform-origin: -5% 22% 0px;
  transform: rotateY(-21deg); */
  background-color: #ffffff;
  transform: scale(0.999);
  color: black;
  font-size: 15px;
  box-shadow: 0px 0px 6px 2px #dfe0e0, inset 3px 3px 4px #00000036,
    inset -3px -3px 4px #00000036, inset -5px -5px 10px 10px white;
}
li.done {
  background-color: #80deea;
  box-shadow: 1px 1px 5px 2px #18a094;
  color: white;
}
.next,
.submit {
  position: fixed;
  bottom: 4rem;
  padding: 2rem 2rem;
  color: #ffffff;
  outline: none;
  width: 80%;
  /* height: 3rem; */
  font-size: 30px;
  border: none;
  cursor: pointer;
  /* display: none; */
  background-color: #f75940;
  -webkit-box-shadow: 2px 2px 10px 2px #38444a;
  box-shadow: 0px 1px 10px 2px #38444a4f;
  border-radius: 8px;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
}
.submit {
  background-color: #ff5722;
}
.submit:hover,
.next:hover,
.showupload:hover {
  background: #41b6e6;
  color: white;
  /* filter: drop-shadow(0px 0px 2px #ffffff); */
  /* border: 5px solid #fff; */
  box-shadow: 0px 0px 20px 1px #ffffff;
}
.container {
  width: 80%;
  padding: 2vw;
}
.box {
  width: 100%;
  padding: 2vw;
}
.title {
  font-weight: bold;
  padding-bottom: 5px;
  font-size: 2rem;
  text-align: left;
  margin-bottom: 2vw;
  font-family: sans-serif;
  letter-spacing: 0px;
  position: relative;
}
.title::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0%;
  height: 10px;
  width: 100%;
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(#fff176),
    to(#ffb74d)
  );
  background-image: linear-gradient(to left, #fff176, #ffb74d);
}
.chooseItem {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 2vw 0;
  cursor: pointer;
  transition: all 0.4s;
}
.chooseItem:hover {
  background-color: #4d638c;
  color: white;
  /* border: 1px dashed red; */
  -webkit-transform: translate(0, -10px);
  transform: scale(1.03);
  -webkit-box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px 1px rgb(0 0 0 / 30%), inset 0px 0px 4px 4px white;
}
.item {
  width: 90%;
  padding: 2%;
  -webkit-box-shadow: 0px 3px 8px rgb(0 0 0 / 30%);
  box-shadow: 3px 3px 6px #60606059, inset 1px 1px 5px #ffffff;
  border-radius: 8px;
  display: none;
  margin: 20px auto;
  background-color: #fcfcfc;
}
input[type='file'],
.showupload {
  box-shadow: 1px 1px 6px -1px rgb(0 0 0 / 52%);
  border: none;
  outline: none;
  padding: 2vw;
  justify-content: center;
  align-items: center;
  display: none;
}
.showupload {
  background-color: #fd7013;
  color: white;
  border-radius: 5px;
  display: flex;
  transition: all 0.5s;
  cursor: pointer;
}
input[type='radio'],
input[type='checkbox'] {
  transform: scale(1.5);
  cursor: pointer;
  margin: 0 5vw 0 2vw;
}
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* padding-top: 20%; */

  /* display: none; */
}
#app {
  background-color: #eeeeee;
}
.error_list {
  width: 100vw;
  /* height: 100vh; */
  height: 0vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
}
.error_list_show {
  height: 100vh;
}
.actual_result {
  display: none;
  color: white;
  text-align: center;
  padding: 2%;
  background: linear-gradient(179deg, #4dd0e1, #8acd67);
}
</style>
