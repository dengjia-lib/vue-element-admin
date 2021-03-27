<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="'https://wpimg.wallstcn.com/57ed425a-c71e-4201-9428-68760c0537c4.jpg'+avatarPrefix"
        >
        <span class="username text-muted">钢铁侠</span>
        <span class="description">公开分享 - 7:30 PM today</span>
      </div>
      <p>
        《钢铁侠》（Iron
        Man）是由美国漫威电影工作室出品的一部科幻冒险电影，改编自同名系列漫画，由乔恩·费儒执导，小罗伯特·唐尼及格温妮斯·帕特洛、杰夫·布里吉斯等主演。该作也是“漫威电影宇宙”系列的首部电影。该片于2008年5月2日在美国上映，2008年4月30日在中国大陆上映。影片讲述了托尼·史塔克在一次绑架事件后改进了盔甲的功能，化身“钢铁侠”，以一个义务警察的身份保护了这个世界和平的故事。
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            分享
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            ❤ 喜欢
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="'https://wpimg.wallstcn.com/9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg'+avatarPrefix"
        >
        <span class="username text-muted">美国队长</span>
        <span class="description">已传送讯息给您 - yesterday</span>
      </div>
      <p>
        美国队长（Captain America）是美国漫威漫画旗下超级英雄，初次登场于《美国队长》（Captain America
        Comics）第1期（1941年3月），由乔·西蒙和杰克·科比联合创造，被视为美国精神的象征。本名史蒂夫·罗杰斯（Steve
        Rogers），1918年7月4日出生于美国纽约布鲁克林区，原本是一名身体瘦弱的年轻人，在接受美国政府的改造后，成为各项体能都远超常人的“超级战士”，还被美国政府赋予了由世界上最坚硬的金属之一振金制成的盾牌，并在二战中率领侵袭者立下赫赫战功。
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            分享
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            ❤ 喜欢
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg'+avatarPrefix"
        >
        <span class="username">蜘蛛侠</span>
        <span class="description">发表了4张照片 - 2 days ago</span>
      </div>
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="220px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item+carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            分享
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            ❤ 喜欢
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  data() {
    return {
      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
