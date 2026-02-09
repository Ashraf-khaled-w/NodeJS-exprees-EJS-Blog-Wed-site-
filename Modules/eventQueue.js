let isWritingUser = false;

const queueUserSafly = async (data) => {
  while (isWritingUser) {
    await new Promise((resolve) => setTimeout(() => resolve(), 100));
  }
  isWritingUser = true;
  try {
    await data();
  } catch (err) {
    console.log(err);
  } finally {
    isWritingUser = false;
  }
};

let isWritingPost = false;

const queuePostSafly = async (data) => {
  while (isWritingPost) {
    await new Promise((resolve) => setTimeout(() => resolve(), 100));
  }
  isWritingPost = true;
  try {
    await data();
  } catch (err) {
    console.log(err);
  } finally {
    isWritingPost = false;
  }
};

export { queueUserSafly, queuePostSafly };
