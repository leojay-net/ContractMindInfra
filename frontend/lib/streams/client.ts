/**
 * Somnia Data Streams SDK Client
 * Core SDK initialization and client management
 */

import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams';
import {
    createPublicClient,
    createWalletClient,
    http,
    webSocket,
    toHex,
    type Hex,
    type Address,
    type PublicClient,
    type WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { somniaTestnet, SCHEMAS, EVENT_SCHEMAS } from './config';

// Cached SDK instances
let publicSDK: SDK | null = null;
let walletSDK: SDK | null = null;
let wsSDK: SDK | null = null;

// Cached schema IDs
const schemaIdCache: Map<string, Hex> = new Map();

// Cached schema encoders
const encoderCache: Map<string, SchemaEncoder> = new Map();

/**
 * Get a read-only SDK instance (for fetching data)
 */
export function getPublicSDK(): SDK {
    if (!publicSDK) {
        const publicClient = createPublicClient({
            chain: somniaTestnet,
            transport: http(somniaTestnet.rpcUrls.default.http[0]),
        });
        publicSDK = new SDK({ public: publicClient });
    }
    return publicSDK;
}

/**
 * Get a wallet-enabled SDK instance (for publishing data)
 * NOTE: Only use in server-side code or secure environments
 */
export function getWalletSDK(privateKey: Hex): SDK {
    const account = privateKeyToAccount(privateKey);
    const publicClient = createPublicClient({
        chain: somniaTestnet,
        transport: http(somniaTestnet.rpcUrls.default.http[0]),
    });
    const walletClient = createWalletClient({
        account,
        chain: somniaTestnet,
        transport: http(somniaTestnet.rpcUrls.default.http[0]),
    });
    return new SDK({ public: publicClient, wallet: walletClient });
}

/**
 * Get a WebSocket-enabled SDK instance (for real-time subscriptions)
 */
export function getWebSocketSDK(): SDK {
    if (!wsSDK) {
        const wsClient = createPublicClient({
            chain: somniaTestnet,
            transport: webSocket('wss://dream-rpc.somnia.network'),
        });
        wsSDK = new SDK({ public: wsClient });
    }
    return wsSDK;
}

/**
 * Compute schema ID from schema string (with caching)
 */
export async function getSchemaId(schema: string): Promise<Hex> {
    const cached = schemaIdCache.get(schema);
    if (cached) return cached;

    const sdk = getPublicSDK();
    const schemaId = await sdk.streams.computeSchemaId(schema);
    if (schemaId && !(schemaId instanceof Error)) {
        schemaIdCache.set(schema, schemaId as Hex);
        return schemaId as Hex;
    }
    throw new Error('Failed to compute schema ID');
}

/**
 * Get schema encoder (with caching)
 */
export function getSchemaEncoder(schema: string): SchemaEncoder {
    const cached = encoderCache.get(schema);
    if (cached) return cached;

    const encoder = new SchemaEncoder(schema);
    encoderCache.set(schema, encoder);
    return encoder;
}

/**
 * Generate a unique data ID
 */
export function generateDataId(prefix: string, suffix?: string): Hex {
    const uniquePart = suffix || Date.now().toString();
    return toHex(`${prefix}-${uniquePart}`, { size: 32 });
}

/**
 * Convert string to bytes32
 */
export function toBytes32(value: string): Hex {
    return toHex(value, { size: 32 });
}

/**
 * Utility type for decoded stream data
 */
export interface DecodedField {
    name: string;
    type: string;
    value: {
        value?: any;
    } | any;
}

/**
 * Extract value from decoded field
 */
export function extractFieldValue(field: DecodedField): any {
    return field?.value?.value ?? field?.value;
}

/**
 * Parse decoded data array into typed object
 */
export function parseDecodedData<T extends Record<string, any>>(
    fields: DecodedField[],
    fieldNames: string[]
): T {
    const result: Record<string, any> = {};

    for (const field of fields) {
        if (fieldNames.includes(field.name)) {
            result[field.name] = extractFieldValue(field);
        }
    }

    return result as T;
}

/**
 * Check if a schema is registered on-chain
 */
export async function isSchemaRegistered(schemaId: Hex): Promise<boolean> {
    const sdk = getPublicSDK();
    const result = await sdk.streams.isDataSchemaRegistered(schemaId);
    if (result instanceof Error) return false;
    return result ?? false;
}

/**
 * Get schema information from schema ID
 */
export async function getSchemaInfo(schemaId: Hex): Promise<{
    baseSchema: string;
    finalSchema: string;
    schemaId: Hex;
} | null> {
    try {
        const sdk = getPublicSDK();
        const info = await sdk.streams.getSchemaFromSchemaId(schemaId);
        if (info instanceof Error) return null;
        return info;
    } catch (error) {
        console.error('Error fetching schema info:', error);
        return null;
    }
}

// Export types and constants
export { SDK, SchemaEncoder, zeroBytes32 };
export type { Hex, Address };
