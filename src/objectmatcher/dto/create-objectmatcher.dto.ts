
export class CreateObjectmatcherDto {
    type: 'GATSCensusImports' | 'GATSCensusExports' | 'GATSCensusImportsExports'
    owner: string
    watchCodes: string[]
    notificationType: 'none' | 'email' | 'sms' | 'both'
}
