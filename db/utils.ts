import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('auth-token');

export async function getUsers() {
  try {
    const res = await fetch(``, {

    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function getUser() {
  try {
    const res = await fetch(``, {

    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function registerUserWithUID(
  displayName: string, email: string, photoURL: string, uid: string
) {
  console.log("storeUsers", uid);
  try {
    const res = await fetch(`/api/users/${uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        displayName, email, photoURL
      })
    });
    const newUser = await res.json();
    console.log(newUser);
    return newUser;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateLastLogin(uid: string) {
  try {
    const res = await fetch(`/api/users/${uid}?type=signin`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    });
    const updatedUser = await res.json();
    console.log(updatedUser);
    return updatedUser;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateUser() {
  try {
    const res = await fetch(``, {
      
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function deleteUser() {
  try {
    const res = await fetch(``, {
      
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function getChannels() {
  try {
    const res = await fetch('/api/channels', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const channels = await res.json();
    console.log('getChannels', channels);
    return channels;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function addBanner(
  cid: string,
  content: string,
  tagOptions: string[]
): Promise<boolean | null> {
  try {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cid, content, tagOptions
      })
    });
    const addBannerAck = await res.json();
    console.log(addBannerAck);
    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function getBanner() {
  try {
    const res = await fetch('/api/banners', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const banner = await res.json();
    console.log('getBanner', banner);
    return banner;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function sendMessage(
  uid: string,
  cid: string,
  senderName: string | null,
  senderPhotoURL: string | null,
  message: string
) {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        uid, cid, senderName, senderPhotoURL, message
      })
    });
    const sendMessageAck = await res.json();
    console.log(sendMessageAck);
    return sendMessageAck;
  } catch (err) {
    console.error(err);
    return null;
  }
};