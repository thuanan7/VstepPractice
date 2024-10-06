import axios from "axios";
import yaml from 'js-yaml';
import {ConferenceAttributes, IConferenceDeadlineModel} from "../../models/conference.model";
import {AoETime, convertToTimeUTC0} from "../../utils/dateUtils";
import moment from "moment";

interface ICcfddlItems {
    title: string;
    description: string;
    dblp: string;
    confs: ICcfddlItemsConfs[]
}

interface ICcfddlItemsConfs {
    year: number,
    id: string,
    link: string,
    timeline: ICcfddlItemTimeline[],
    timezone: string,
    date: string,
    place: string

}

interface ICcfddlItemTimeline {
    abstract_deadline: string,
    deadline: string
}

function getFutureComments(comments: IConferenceDeadlineModel[], currentTime: string) {
    const futureComments = comments.filter(comment => {
        const deadline = moment(comment.deadline);
        const current = moment(currentTime);

        return deadline.isAfter(current);
    });
    return futureComments.sort((a, b) => {
        const deadlineA = moment(a.deadline);
        const deadlineB = moment(b.deadline);
        // @ts-ignore
        return deadlineA - deadlineB;
    });
}

export async function fetchDataFromYamlCcfddl(url: string, websiteId: number, year: number, currentTime: string) {
    try {
        const rs: ConferenceAttributes[] = [];
        const response = await axios.get(url);
        const data = yaml.loadAll(response.data);
        if (data.length > 0) {
            const items = data[0] as ICcfddlItems[];
            items.forEach(e => {
                if (e.confs.length) {
                    e.confs.filter(x => x.year === year).forEach(x => {

                        const deadlines = x.timeline.filter(y => (y?.deadline || '') !== '').map(y => {
                            return ({
                                comment: y.abstract_deadline,
                                deadline: convertToTimeUTC0(y.deadline, x.timezone)
                            })
                        });

                        const futureComments = getFutureComments(deadlines, currentTime);
                        const deadline = futureComments.length > 0 ? futureComments[0] : undefined;

                        rs.push({
                            title: e.title,
                            description: e.description,
                            websiteId,
                            urlDestination: x.link,
                            location: x.place,
                            timezone: x.timezone === AoETime ? 'UTC-12' : x.timezone,
                            date: x.date,
                            deadline: deadline?.deadline || '',
                            comment: deadline?.comment || ''
                        })
                    })
                }
            })
        }
        return rs;
    } catch (error) {
        return null;
    }
}
