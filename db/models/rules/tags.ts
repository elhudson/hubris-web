import { Entry } from "@prisma/client";
import { Tags } from "@prisma/client";

export interface tag extends Entry, Tags {
    
}