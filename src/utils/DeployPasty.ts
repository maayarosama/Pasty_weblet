import { Network } from "../types/Network";
import type { Disk, Env } from "../types/pasty";
import type Pasty from "../types/pasty";
import createNetwork from "./CreateNetwork";
import getGrid from "./getGrid";

export default async function deployPasty(
    data: Pasty,
    type: "vm"
) {

    const grid = await getGrid();
 
    const { MachineModel, MachinesModel, QSFSDiskModel } = window.grid3_client;
    const { envs, disks, rootFs, ...base } = data;
    const { name, flist, cpu, memory, entrypoint, network: nw } = base;
    const { publicIp, planetary, node_id, publicIp6 } = base;



    const vm = new MachineModel();
    vm.name = name;
    vm.node_id = base.nodeId;

    vm.disks = disks.map(createDisk);
    vm.public_ip = publicIp;
    vm.public_ip6 = publicIp6;
    vm.planetary = planetary;
    vm.cpu = cpu;
    vm.memory = memory;
    vm.rootfs_size = rootFs;
    vm.flist = "https://hub.grid.tf/mayarosama.3bot/mayarosama-zinitpasty-latest.flist";
    vm.entrypoint = entrypoint;
    vm.env = type == "vm" ? createEnvs(envs) : { SSH_KEY: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCOOhPdvBaCl5/a7uLvEuA4Othrhfqc1egO29n602oGwqILzZoP3nG4DQe4fzlrnu3tkUB9yw6Vq1HOywWPkRx/1yKg2eey0gfhXcuDTrlbloTXaDX5bG1NMZJv4w5CSyOTks0e3N1p7eDBsR5Ipa0lAW36FaKhMVK+6EUCpRqnZK/n6CAmrhuxWgsGorDm4ahFHRhymBJqIX40BS2ETnIcjwgHV/4PuIMZr34nmDdllphEsBc8Qg/6Te4DLPd6vy0pWJA9GkbDMW72IZLUfUgxnQOGq6ywsGwKLqwHdDL6nnCY088tewM5vfvctVGenA4iYG71KCCfuo7PFTnwpDugzXH22kgDdWhPRkguixny2IgIkxwosIHzu03nuswlf8FXKJpmMILBvmn3rdwhdEaOpoyBxYzh2TqmkE6Q606yvoFXB81JKLEiZxyCn9oXjZGF6sdjGbZHTDuw7CsktRvGi0Rq9sCBnW0xZSGh8rrAxeaRNlfZnS+CAr9QvTjutrE= mayarosama18@gmail.com" };
console.log("vm", vm)
    const vms = new MachinesModel();
    vms.name = name;
    vms.network = createNetwork(new Network());
    vms.machines = [vm];
    const metadate = {
        type: "vm",
        name: name,
        projectName: "vm",
    };
    vms.metadata = JSON.stringify(metadate);
    const res = await grid.machines.deploy(vms);

    const pasty =await grid.machines.getObj(vms.name);
    return pasty;
}

function createDisk({ name, size, mountpoint }: Disk) {
    const { DiskModel } = window.grid3_client;
    const disk = new DiskModel();
    disk.name = name;
    disk.size = size;
    disk.mountpoint = mountpoint;

    return disk;
}

function createEnvs(envs: Env[]): { [key: string]: string } {
    return envs.reduce((res, env) => {
        res[env.key] = env.value;
        return res;
    }, {});
}