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
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Progress,
    Checkbox,
} from "@chakra-ui/react"
// Custom components

import Card from "components/card/Card.js"

import Web3Modal from "web3modal"
import Web3 from "web3"
import { ToastContainer, toast } from "react-toastify"
export default function Marketplace() {
    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white")
    const textColorBrand = useColorModeValue("brand.500", "white")
    const [checkHarvesterAddress, setCheckHarvesterAddress] = useState("")

    const web3 = new Web3(Web3.givenProvider)

    const contractAbi = require("../../../contracts/durianSupplyChain.json").abi
    const {
        DurianSupplyChain: contractAddress,
    } = require("../../../contracts/contract-address.json")
    const contract = new web3.eth.Contract(contractAbi, contractAddress)

    const [foundDurianData, setFoundDurianData] = useState(null)

    const [durians, setDurians] = useState([])
    useEffect(() => {
        async function fetchData() {
            console.log(contract)

            try {
                const count = await contract.methods.stockUnit().call()
                console.log(contract)
                const durianCodes = await contract.methods.getAllDurianCodes().call()

                // Loop through all the durians in the mapping and get their data
                const durianData = []
                for (let i = 0; i < count; i++) {
                    const bufferOne = await contract.methods
                        .fetchDurianBufferOne(durianCodes[i])
                        .call()
                    const durianCodes2 = await contract.methods
                        .fetchDurianBufferTwo(durianCodes[i])
                        .call()

                    // Combine the data from the two buffers into a single object
                    var digit = Number(bufferOne.durianState)
                    const durian = {
                        id: i,
                        durianToCode: bufferOne.durianToCode,

                        owner: bufferOne.ownerID,
                        tree: bufferOne.durianTree,
                        farm: bufferOne.durianFarm,
                        status: bufferOne.durianState,
                        taste: durianCodes2.taste,
                        creaminess: durianCodes2.creaminess,
                        harvestedDurianPrice: durianCodes2.harvestedDurianPrice,
                        harvestedTime: bufferOne.harvestedTime,
                    }

                    // Add the durian data to the array
                    durianData.push(durian)
                }

                // Update the state with the durian data
                setDurians(durianData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    return (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
            <SimpleGrid columns={1} spacing={6}></SimpleGrid>

            {foundDurianData && (
                <Card mt={4}>
                    <Box p="6">
                        {Object.entries(foundDurianData).map(([key, value]) => (
                            <Flex
                                key={key}
                                alignItems="center"
                                justifyContent="space-between"
                                mt={2}
                            >
                                <Text fontWeight="bold" color={textColor}>
                                    {key}
                                </Text>
                                <Text color={textColorBrand}>{value}</Text>
                            </Flex>
                        ))}
                    </Box>
                </Card>
            )}

            <Card marginTop="4">
                <Box>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Durian Owner</Th>
                                <Th>Durian ID</Th>
                                <Th>Durian Tree</Th>
                                <Th>Durian Status</Th>
                                <Th>Durian Taste</Th>

                                <Th>Durian Creaminess</Th>
                                <Th>Durian harvestedDurianPrice</Th>
                                <Th>Durian harvestedTime</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {durians.map((durian) => (
                                <Tr key={durian.id}>
                                    <Td>{durian.owner}</Td>

                                    <Td>{durian.durianToCode}</Td>
                                    <Td>{durian.tree}</Td>
                                    <Td>{durian.status}</Td>
                                    <Td>{durian.taste}</Td>
                                    <Td>{durian.creaminess}</Td>
                                    <Td>{durian.harvestedDurianPrice} ETH</Td>

                                    <Td>{durian.harvestedTime}</Td>

                                    <Td></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Card>
        </Box>
    )
}
