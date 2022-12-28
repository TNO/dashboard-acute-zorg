import pandas as pd 
import numpy as np 
import functools 

def divide_stapeldrukte_by_7(stapeldrukte):
    return [ {'hour': hour_value['hour'], 'value': hour_value['value'] / 7}
             for hour_value in stapeldrukte ]

def sum_stapeldruktes(stapeldrukte1, stapeldrukte2):
    return [ {'hour': hour_value_1['hour'], 'value': hour_value_1['value'] + hour_value_2['value']}
             for hour_value_1, hour_value_2 in zip(stapeldrukte1, stapeldrukte2) ]

def max_stapeldruktes(stapeldrukte1, stapeldrukte2):
    return [ {'hour': hour_value_1['hour'], 'value': max(hour_value_1['value'], hour_value_2['value'])}
             for hour_value_1, hour_value_2 in zip(stapeldrukte1, stapeldrukte2) ]
    
def to_camelcase(string):
    output = ''.join(x for x in string.title() if x.isalnum())
    return output[0].lower() + output[1:]


def capitalize_seh(string):
    return string.replace('Seh', 'SEH') 

def capitalize_ehh(string):
    return string.replace('Ehh', 'EHH') 

def capitalize_ct(string):
    return string.replace('Ct', 'CT') 

def remove_janee(string):
    return string.replace('JaNee', '')

class SEHFormParser:

    def __init__(self, excel_filepath):
        self.excel_filepath = excel_filepath
    
    @staticmethod
    def to_stapeldrukte(keyvalue_dict): 
        stapeldrukte = [{'hour': int(key[:2]), 'value': value} for key, value in keyvalue_dict.items()]
        return stapeldrukte
        
    def get_excel_columns_as_dict(self, key_col, value_col, start_index, end_index=None,
                                  value_type = float):
        
        nrows = end_index-(start_index-1) if end_index is not None else 1
        df = pd.read_excel(self.excel_filepath, skiprows=start_index-1,  nrows=nrows, 
                        usecols = f'{key_col},{value_col}', header=None, index_col=0)
        
        series = df.iloc[:, 0]
        invalid_dct = {'nvt': np.nan, '-': np.nan, '': np.nan, '?': np.nan}
        if value_type is float:
            series = series.replace(invalid_dct).astype(float)
        elif value_type is str:
            series = series.replace(invalid_dct).astype(str)
            series = series.fillna('Ja').replace({'Ja': True, 'JA': True, 'ja': True,
                                                  'Nee': False, 'NEE': False, 'nee': False})
            
        dct = series.to_dict()
        
        key_mappings = [str, to_camelcase, capitalize_seh, capitalize_ehh, capitalize_ct, remove_janee]
        for key_mapping in key_mappings:
            dct = {key_mapping(k):v for k,v in dct.items()}
            
        return dct

    
    def parse(self) -> dict:
        f2018 = {}
        f2019 = {}
        root = {
            '2018': f2018, 
            '2019': f2019,
        }
        
        # 1 
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 13))
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 13))
        # 2
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 15)) 
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 15)) 
        # 3a
        f2018.update({**self.get_excel_columns_as_dict('B', 'D', 17),
                      **self.get_excel_columns_as_dict('B', 'D', 18, value_type=bool)}) 
        f2019.update({**self.get_excel_columns_as_dict('B', 'K', 17),
                      **self.get_excel_columns_as_dict('B', 'K', 18, value_type=bool)}) 
        # 3b 
        f2018['totaalAantalSEHBezoekenPerMaand'] = {**self.get_excel_columns_as_dict('C', 'D', 20, 31),
                                                    **self.get_excel_columns_as_dict('B', 'D', 32, value_type=bool)}
        f2019['totaalAantalSEHBezoekenPerMaand'] = {**self.get_excel_columns_as_dict('C', 'K', 20, 31),
                                                    **self.get_excel_columns_as_dict('B', 'K', 32, value_type=bool)}
        # 3c 
        f2018['aantalBezoekenPerLeeftijdsgroepOpSEH'] = {**self.get_excel_columns_as_dict('C', 'D', 34, 39),
                                                         **self.get_excel_columns_as_dict('B', 'D', 40, value_type=bool)}
        f2019['aantalBezoekenPerLeeftijdsgroepOpSEH'] = {**self.get_excel_columns_as_dict('C', 'K', 34, 39),
                                                         **self.get_excel_columns_as_dict('B', 'K', 40, value_type=bool)}
        # 3d 
        f2018['herkomstVanPatientenOpSEHViaAmbulance'] = {**self.get_excel_columns_as_dict('B', 'D', 42),
                                                          **self.get_excel_columns_as_dict('B', 'D', 43, value_type=bool)}
        f2019['herkomstVanPatientenOpSEHViaAmbulance'] = {**self.get_excel_columns_as_dict('B', 'K', 42),
                                                          **self.get_excel_columns_as_dict('B', 'K', 43, value_type=bool)}
        # 3e
        f2018['herkomstVanPatientenOpSEHViaVerwijzing'] = {**self.get_excel_columns_as_dict('B', 'D', 45, 48),
                                                           **self.get_excel_columns_as_dict('B', 'D', 49, value_type=bool)}
        f2019['herkomstVanPatientenOpSEHViaVerwijzing'] = {**self.get_excel_columns_as_dict('B', 'K', 45, 48),
                                                           **self.get_excel_columns_as_dict('B', 'K', 49, value_type=bool)}
        # 3f
        f2018['stapeldruktePerDag'] = {  
            'mon': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 52, 75)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 52, 75))},
            'tue': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 77, 100)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 77, 100))},
            'wed': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 102, 125)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 102, 125))},
            'thu': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 127, 150)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 127, 150))},
            'fri': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 152, 175)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 152, 175))},
            'sat': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 177, 200)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 177, 200))},
            'sun': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'D', 202, 225)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'E', 202, 225))},
            **self.get_excel_columns_as_dict('B', 'D', 226, value_type=bool),
        }
        f2019['stapeldruktePerDag'] = {  
            'mon': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 52, 75)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 52, 75))},
            'tue': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 77, 100)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 77, 100))},
            'wed': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 102, 125)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 102, 125))},
            'thu': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 127, 150)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 127, 150))},
            'fri': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 152, 175)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 152, 175))},
            'sat': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 177, 200)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 177, 200))},
            'sun': {'max': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'K', 202, 225)), 
                    'gem': self.to_stapeldrukte(self.get_excel_columns_as_dict('C', 'L', 202, 225))},
            **self.get_excel_columns_as_dict('B', 'K', 226, value_type=bool),
        }
        # 3g
        f2018['doorlooptijdSEH'] = {**self.get_excel_columns_as_dict('B', 'D', 228, 229),
                                    **self.get_excel_columns_as_dict('B', 'D', 230, value_type=bool)}
        f2019['doorlooptijdSEH'] = {**self.get_excel_columns_as_dict('B', 'K', 228, 229),
                                **self.get_excel_columns_as_dict('B', 'K', 230, value_type=bool)}
        # 4a
        f2018['specialismeVerdeling'] = self.get_excel_columns_as_dict('C', 'D', 233, 242)
        f2019['specialismeVerdeling'] = self.get_excel_columns_as_dict('C', 'K', 233, 242)
        # 4b 
        f2018['aantalRegistratiesPerBestemmingNaAfloopSEHBezoek'] = self.get_excel_columns_as_dict('B', 'D', 244, 247)
        f2019['aantalRegistratiesPerBestemmingNaAfloopSEHBezoek'] = self.get_excel_columns_as_dict('B', 'K', 244, 247)
        # 4c 
        f2018['aantalOpgenomenPatientenVanafSEHNaarKliniekICCCUDBCstroke'] = self.get_excel_columns_as_dict('B', 'D', 249, 252)
        f2019['aantalOpgenomenPatientenVanafSEHNaarKliniekICCCUDBCstroke'] = self.get_excel_columns_as_dict('B', 'K', 249, 252)

        # 5
        
        # 6a
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 258))
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 258))
        # 6b
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 260))
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 260))
        # 6c
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 262))
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 262))
        # 6d
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 264))
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 264))
        # 6e
        f2018.update(self.get_excel_columns_as_dict('B', 'D', 266))
        f2019.update(self.get_excel_columns_as_dict('B', 'K', 266))
        

        # calculate week data 
        days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

        stapeldruktes_2018_gem = [ f2018['stapeldruktePerDag'][day]['gem'] for day in days ]
        stapeldruktes_2018_max = [ f2018['stapeldruktePerDag'][day]['max'] for day in days ]
        stapeldruktes_2019_gem = [ f2019['stapeldruktePerDag'][day]['gem'] for day in days ]
        stapeldruktes_2019_max = [ f2019['stapeldruktePerDag'][day]['max'] for day in days ]
        
        f2018['stapeldruktePerDag']['week'] = {
            'gem': divide_stapeldrukte_by_7(functools.reduce(sum_stapeldruktes, stapeldruktes_2018_gem )),
            'max': functools.reduce(max_stapeldruktes, stapeldruktes_2018_max)
        }
        
        f2019['stapeldruktePerDag']['week'] = {
            'gem': divide_stapeldrukte_by_7(functools.reduce(sum_stapeldruktes, stapeldruktes_2019_gem )),
            'max': functools.reduce(max_stapeldruktes, stapeldruktes_2019_max)
        }
        
        return root