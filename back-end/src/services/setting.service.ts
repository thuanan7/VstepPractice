import {appConfigs, settingKeys} from "../app/configs";
import Setting from "../models/setting.model";
import job from "../app/job";
import logger from "../app/logger";

export async function updateStatusJobRun(status: boolean) {
    return await updateSettingValue(settingKeys.runJob, status ? "T" : "F");
}


export async function startJob() {
    appConfigs.AUTO_START_JOB && job?.start();
}

async function updateSettingValue(key: string, value: string) {
    let rs = true;
    try {
        const setting = await Setting.findOne({where: {key: key}});
        if (setting) {
            await setting.update({value, updatedAt: new Date()});
            logger.info(`[Job] change setting run job to ${value === 'T'}`)
        } else {
            const rsAdded = await Setting.create({key, value});
            rs = rsAdded.id !== undefined;
        }
    } catch (e) {
        rs = false;
    } finally {
        return rs;
    }
}
``