<script>

const moyaThresh = 80;

const regDBSlideNum = () => {

}

checkGoNextSlide = (moyaDeg) => {
  if(moyaDeg >= moyaThresh){
    nextFlag = alert('生徒のもやもやが溜まっています.\n 現在'+moyaDeg+'%');
    if(nextFlag){
      return false;
    }
  }
  return true;
}

const moveNextSlide = () => {
  if (!checkGoNextSlide()){
    return;
  }
  var nowSlide = getNowSlide();
  nowSlide += 1;
  regDBSlideNum(nowSlide);
}

</script>

<template>
<div></div>
</template>

<style>
</style>