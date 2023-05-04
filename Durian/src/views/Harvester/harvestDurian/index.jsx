import React, { useState, useEffect } from "react"

// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Link,
    Text,
    useColorModeValue,
    Select,
    SimpleGrid,
} from "@chakra-ui/react"

import Card from "components/card/Card.js"

import Web3 from "web3"
import { toast } from "react-toastify"

const web3 = new Web3(Web3.givenProvider)
const contractAbi = require("../../../contracts/durianSupplyChain.json").abi
const { DurianSupplyChain: contractAddress } = require("../../../contracts/contract-address.json")
const contract = new web3.eth.Contract(contractAbi, contractAddress)
export default function Marketplace() {
    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white")
    const textColorBrand = useColorModeValue("brand.500", "white")

    // Initialize state variables
    const [durianId, setDurianId] = useState("")
    const [harvesterAddress, setHarvesterAddress] = useState("")
    const [durianType, setDurianType] = useState("")
    const [durianWeight, setDurianWeight] = useState("")

    // Update state variables on input change
    const handleDurianIdChange = (event) => {
        setDurianId(event.target.value)
    }

    const handleHarvesterAddressChange = (event) => {
        setHarvesterAddress(event.target.value)
    }

    const handleDurianTypeChange = (event) => {
        setDurianType(event.target.value)
    }

    const handleDurianWeightChange = (event) => {
        setDurianWeight(event.target.value)
    }

    // Log state variables on form submit
    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(contract)
        const addresses = await web3.eth.getAccounts()
        try {
            await contract.methods
                .produceDurianByHarvester(durianId, harvesterAddress, durianType, durianWeight)
                .send({ from: addresses[0] })

            // Display success message
            toast.success("Harvest Durian Added Succesfully!")
            console.log("CHECK")
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    return (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
            <SimpleGrid columns={1} spacing={6}>
                <Card>
                    <Box p="6">
                        <Box textAlign="center">
                            <Text fontSize="xl" fontWeight="bold" color={textColor}>
                                Harvester Durian
                            </Text>
                        </Box>
                        <Box my={4} textAlign="left">
                            <SimpleGrid columns={2} spacing={3}>
                                <FormControl>
                                    <FormLabel htmlFor="durianId" color={textColor}>
                                        Durian ID
                                    </FormLabel>
                                    <Input
                                        id="durianId"
                                        colorScheme="white"
                                        color={textColor}
                                        value={durianId}
                                        onChange={handleDurianIdChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="harvesterAddress" color={textColor}>
                                        Harvester Durian Tree
                                    </FormLabel>
                                    <Input
                                        id="harvesterAddress"
                                        colorScheme="white"
                                        color={textColor}
                                        value={harvesterAddress}
                                        onChange={handleHarvesterAddressChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="durianWeight" color={textColor}>
                                        Harvester Durian Farm
                                    </FormLabel>
                                    <Input
                                        id="durianWeight"
                                        colorScheme="white"
                                        color={textColor}
                                        type="number"
                                        value={durianType}
                                        onChange={handleDurianTypeChange}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="durianWeight" color={textColor}>
                                        Harvester Durian Price
                                    </FormLabel>
                                    <Input
                                        id="durianWeight"
                                        colorScheme="white"
                                        color={textColor}
                                        type="number"
                                        value={durianWeight}
                                        onChange={handleDurianWeightChange}
                                    />
                                </FormControl>
                            </SimpleGrid>
                            <Button mt={4} colorScheme="blue" type="submit" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </SimpleGrid>
        </Box>
    )
}
