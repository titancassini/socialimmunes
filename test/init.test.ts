import { register, login } from "../src/blockchain/UserService";
import { getANumber, makeKeyPair } from "./helper";


import * as bip39 from "bip39";
import { User } from "../src/types";

jest.setTimeout(30000);


describe('User Authentication', () => {

    const admin = {
        name: "admin",
        password: "admin",
        mnemonic: bip39.generateMnemonic(160)
    }

    const user01 = {
        name: "User01_" + getANumber(),
        password: "userPSW1",
        mnemonic: bip39.generateMnemonic(160)
    };


    it("register user " + user01.name, async done => {
        expect.assertions(1);
        
        await expect(register(user01.name, user01.password, user01.mnemonic)).resolves.toBe(null);
        console.log("Registered", user01.name, " with mnemonic", user01.mnemonic);
        done();
    });

    it("register and login admin user", async done => {
        expect.assertions(1);

        await expect(register(admin.name, admin.password, admin.mnemonic)).resolves.toBe(null);
        console.log("Registered", admin.name, "with mnemonic", admin.mnemonic);
        done();
    });

    it("login user " + user01.name, async done => {
        expect.assertions(3);

        const user: User = await login(user01.name, user01.password, user01.mnemonic);
        console.log("Logged in", user);

        expect(user).toBeDefined();
        expect(user.name).toBe(user01.name);
        expect(user.seed).toBeDefined();
        done();
    });
});