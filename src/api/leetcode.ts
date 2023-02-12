import jwtDecode from 'jwt-decode';

class LeetCodeSingleton {
  private static instance: LeetCodeSingleton;
  private decoded: any;

  private constructor(sessionCookie: string) {
    this.decoded = jwtDecode(sessionCookie);
  }

  public static getInstance(sessionCookie: string): LeetCodeSingleton {
    if (!LeetCodeSingleton.instance) {
      LeetCodeSingleton.instance = new LeetCodeSingleton(sessionCookie);
    }

    return LeetCodeSingleton.instance;
  }

  public getUserName() {
    return this.decoded.username;
  }
}

export default LeetCodeSingleton;