import { merge } from "./credentials";

test("test merge", () => {
  const cryptoKey = {} as CryptoKey;
  describe("merge", () => {
    const source = [
      {
        idx: -1,
        url: "example.com",
        username: "user1",
        password: "pass1",
        onChain: false,
      },
      {
        idx: -1,
        url: "example.org",
        username: "user2",
        password: "pass2",
        onChain: false,
      },
    ];
    const onChain = [
      {
        idx: -1,
        url: "example.com",
        username: "user1",
        password: "pass1",
        onChain: true,
      },
      {
        idx: -1,
        url: "example.org",
        username: "user2",
        password: "pass2",
        onChain: true,
      },
    ];

    it("should merge source and onChain credentials", async () => {
      const merged = await merge(cryptoKey, source, onChain);

      expect(merged).toHaveLength(2);
      expect(merged[0]).toEqual(onChain[0]);
      expect(merged[1]).toEqual(onChain[1]);
    });
  });

  it("should throw an error if onChain entry exists after offChain entry", async () => {
    const invalidOnChain = [
      {
        idx: 1,
        url: "example.com",
        username: "user1",
        password: "pass1",
        onChain: true,
      },
      {
        idx: 2,
        url: "example.org",
        username: "user2",
        password: "pass2",
        onChain: false,
      },
    ];

    await expect(merge(cryptoKey, source, invalidOnChain)).rejects.toThrow(
      "Assertion error: onChain entry exists after offChain entry. Cannot merge with onChain entries"
    );
  });

  it("should throw an error if offChain entry exists after onChain entry", async () => {
    const invalidSource = [
      {
        idx: 1,
        url: "example.com",
        username: "user1",
        password: "pass1",
        onChain: false,
      },
      {
        idx: 2,
        url: "example.org",
        username: "user2",
        password: "pass2",
        onChain: true,
      },
    ];

    await expect(merge(cryptoKey, invalidSource, onChain)).rejects.toThrow(
      "Assertion error: onChain entry exists after offChain entry. Cannot merge with onChain entries"
    );
  });

  it("should throw an error if there is a mismatch between onChain and offChain entries", async () => {
    const invalidOnChain = [
      {
        idx: 1,
        url: "example.com",
        username: "user1",
        password: "pass1",
        onChain: true,
      },
      {
        idx: 2,
        url: "example.org",
        username: "user2",
        password: "pass2",
        onChain: true,
      },
    ];

    await expect(merge(cryptoKey, source, invalidOnChain)).rejects.toThrow(
      "Assertion error: mismatch between onChain and offChain entries at index 0: " +
        '(onChain: {"idx":1,"url":"example.com","username":"user1","password":"pass1","onChain":true},' +
        ' offChain: {"idx":1,"url":"example.com","username":"user1","password":"pass1","onChain":false})'
    );
  });
});
