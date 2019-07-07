import {Election, User} from "../types";
import {GTX} from "./Postchain";
import {seedToKey} from "./CryptoService";
import {sortByFrequency, uniqueId} from "../util/util";

//const dayInMilliseconds: number = 86400000;
const dayInMilliseconds: number = 10000;

export function triggerElection(user: User): void {
    const {privKey, pubKey} = seedToKey(user.seed);

    const tx = GTX.newTransaction([pubKey]);
    tx.addOperation("triggerElection", user.name, uniqueId(), Date.now() + (dayInMilliseconds * 7));
    tx.sign(privKey, pubKey);
    tx.postAndWaitConfirmation();
}

export function completeElection(user: User, electionId: string): void {
    const {privKey, pubKey} = seedToKey(user.seed);

    GTX.query("getElectionVotes", { electionId: electionId })
        .then((candidates: any[]) => {
            const sortedCandidates: string[] = sortByFrequency(candidates);
            const tx = GTX.newTransaction([pubKey]);

            tx.addOperation("completeElection", user.name, electionId, sortedCandidates);
            tx.sign(privKey, pubKey);
            tx.postAndWaitConfirmation();
        });
}

export function signUpForElection(user: User, electionId: string): Promise<any> {
    const {privKey, pubKey} = seedToKey(user.seed);

    const tx = GTX.newTransaction([pubKey]);
    tx.addOperation("signUpForElection", user.name, electionId);
    tx.sign(privKey, pubKey);
    return tx.postAndWaitConfirmation();
}

export function voteForCandidate(user: User, candidate: string, electionId: string): Promise<any> {
    const {privKey, pubKey} = seedToKey(user.seed);

    const tx = GTX.newTransaction([pubKey]);
    tx.addOperation("voteForCandidate", user.name, candidate, electionId);
    tx.sign(privKey, pubKey);
    return tx.postAndWaitConfirmation();
}

export function getElectionVoteForUser(name: string, electionId: string): Promise<string> {
    return GTX.query("getUserVoteInElection", { name: name, electionId: electionId });
}

export function getElectionCandidates(electionId: string): Promise<string[]> {
    return GTX.query("getElectionCandidates", { electionId: electionId });
}

export function getUncompletedElection(): Promise<string> {
    return GTX.query("getUncompletedElection", {});
}

export function getNextElectionTimestamp(): Promise<Election> {
    return GTX.query("getNextElection", { timestamp: Date.now() });
}