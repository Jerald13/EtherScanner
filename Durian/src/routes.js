import { Icon } from "@chakra-ui/react"
import { MdLocalFlorist, MdShoppingCart, MdStar, MdLocalDining } from "react-icons/md"
import React, { useEffect, useState } from "react"

import HarvestDurian from "views/Harvester/harvestDurian"

import DisplayDurian from "views/Harvester/DisplayDurian"

import PurchasedByDistributor from "views/Harvester/PurchaseByDistributor"

import PurchasedByRetailer from "views/Harvester/PurchasedByRetailer"

import PurchasedByConsumer from "views/Harvester/PurchasedByConsumer"
import RatingByConsumer from "views/Harvester/RatingByConsumer"

let routes = [
    {
        name: "Harvest Durian",
        layout: "/admin",
        path: "/harvestDurian",
        icon: <Icon as={MdLocalFlorist} width="20px" height="20px" color="inherit" />,
        component: HarvestDurian,
    },
    {
        name: "Display Durian",
        layout: "/admin",
        path: "/DisplayDurian",
        icon: <Icon as={MdLocalDining} width="20px" height="20px" color="inherit" />,
        component: DisplayDurian,
    },

    {
        name: "Distributor Purchase Durian",
        layout: "/admin",
        path: "/PurchaseByDistributor",
        icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
        component: PurchasedByDistributor,
    },

    {
        name: "Retailer Purchase Durian",
        layout: "/admin",
        path: "/PurchasedByRetailer",
        icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
        component: PurchasedByRetailer,
    },

    {
        name: "Customer Purchase Durian",
        layout: "/admin",
        path: "/PurchasedByConsumer",
        icon: <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />,
        component: PurchasedByConsumer,
    },
    {
        name: "Customer Rate Durian",
        layout: "/admin",
        path: "/RatingByConsumer",
        icon: <Icon as={MdStar} width="20px" height="20px" color="inherit" />,
        component: RatingByConsumer,
    },
]

export default routes
