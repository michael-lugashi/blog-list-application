const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  let totalLikes = 0;
  for (const blog of blogs) {
    totalLikes += blog.likes;
  }
  return totalLikes;
};

const favoriteBlog = (blogs) => {
  let favoriteBlog;
  let mostLikes = 0;
  for (const blog of blogs) {
    if (blog.likes > mostLikes) {
      favoriteBlog = blog;
      mostLikes = blog.likes;
    }
  }
  return favoriteBlog;
};
const mostBlogs = (blogs) => {
  const authors = [];
  const count = [];

  for (const blog of blogs) {
    authors.push(blog.author);
  }

  count.length = authors.length;
  count.fill(0);

  for (let i = 0; i < authors.length; i++) {
    const firstIndex = authors.indexOf(authors[i]);
    if (firstIndex !== i) {
      count[firstIndex] += 1;
      authors.splice(i, 1);
      i--;
    } else {
      count[i] += 1;
    }
  }
  const max = Math.max(...count);
  const maxIndex = count.indexOf(max);
  return { author: authors[maxIndex], blogs: max };
};

const mostLikes = (blogs) => {
  const authors = [];
  const count = [];
  let subtractedIndex = 0;

  for (const blog of blogs) {
    authors.push(blog.author);
  }

  count.length = authors.length;
  count.fill(0);

  for (let i = 0; i < authors.length; i++) {
    const firstIndex = authors.indexOf(authors[i]);
    if (firstIndex !== i) {
      count[firstIndex] += blogs[i+subtractedIndex].likes;
      authors.splice(i, 1);
      subtractedIndex++;
      i--;
    } else {
      count[i] += blogs[i+subtractedIndex].likes;
    }
  }
  console.log(authors);
  const max = Math.max(...count);
  const maxIndex = count.indexOf(max);
  return { author: authors[maxIndex], likes: max };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
