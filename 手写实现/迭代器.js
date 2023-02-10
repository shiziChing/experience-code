//  如果一个对象上面有Symbol.iterator方法，那么它是可迭代的  字符串、数组、map、set都是可迭代的
//   对象是不可迭代的，可以通过手动添加迭代器，使其可迭代
// 可迭代的可以用  for…of 遍历，否则不行
//  https://blog.csdn.net/m0_71485750/article/details/125448429